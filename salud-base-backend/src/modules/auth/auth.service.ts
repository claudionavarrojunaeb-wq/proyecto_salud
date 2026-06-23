import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import type { StringValue } from 'ms';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { JwtPayload } from './jwt.strategy.js';
import type { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    rut: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.usuarios.findUnique({ where: { rut } });

    if (!user || !user.activo || user.bloqueado) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!user.password_hash) {
      throw new UnauthorizedException('Usuario sin contrasena configurada');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await this.prisma.usuarios.update({
        where: { usuario_id: user.usuario_id },
        data: { intentos_fallidos: { increment: 1 } },
      });
      throw new UnauthorizedException('Credenciales invalidas');
    }

    await this.prisma.usuarios.update({
      where: { usuario_id: user.usuario_id },
      data: { intentos_fallidos: 0, fecha_ultimo_login: new Date() },
    });

    return this.generateTokens(user.usuario_id, user.rut);
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const stored = await this.prisma.refreshTokens.findUnique({
      where: { token: refreshToken },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalido o expirado');
    }

    await this.prisma.refreshTokens.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const user = await this.prisma.usuarios.findUnique({
      where: { usuario_id: stored.usuario_id },
    });

    if (!user || !user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return this.generateTokens(user.usuario_id, user.rut);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshTokens.updateMany({
      where: { token: refreshToken, revoked: false },
      data: { revoked: true },
    });
  }

  async register(
    data: RegisterDto,
  ): Promise<{ usuario_id: number; rut: string; correo_electronico: string }> {
    const existing = await this.prisma.usuarios.findFirst({
      where: {
        OR: [
          { rut: data.rut },
          { correo_electronico: data.correo_electronico },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Ya existe un usuario con este RUT o correo');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.usuarios.create({
      data: {
        rut: data.rut,
        nombres: data.nombres,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        tipo_usuario: data.tipo_usuario,
        correo_electronico: data.correo_electronico,
        tipo_autenticacion: 'LOCAL',
        password_hash: passwordHash,
        activo: true,
        bloqueado: false,
        intentos_fallidos: 0,
      },
    });

    return {
      usuario_id: user.usuario_id,
      rut: user.rut,
      correo_electronico: user.correo_electronico,
    };
  }

  private async generateTokens(
    userId: number,
    rut: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, rut };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m') as StringValue,
    });

    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshTokens.create({
      data: {
        token: refreshToken,
        usuario_id: userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
