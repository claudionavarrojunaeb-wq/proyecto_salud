import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';

export interface JwtPayload {
  sub: number;
  rut: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.usuarios.findUnique({
      where: { usuario_id: payload.sub },
      include: {
        UsuariosRoles_UsuariosRoles_usuario_idToUsuarios: {
          include: {
            Roles: {
              include: {
                RolesPermisos: {
                  include: { Permisos: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.activo || user.bloqueado) {
      throw new UnauthorizedException('Usuario inactivo o bloqueado');
    }

    const usuariosRoles = user.UsuariosRoles_UsuariosRoles_usuario_idToUsuarios;

    return {
      usuario_id: user.usuario_id,
      rut: user.rut,
      nombres: user.nombres,
      primer_apellido: user.primer_apellido,
      roles: usuariosRoles.map((ur) => ur.Roles.codigo),
      permisos: usuariosRoles.flatMap((ur) =>
        ur.Roles.RolesPermisos.map((rp) => rp.Permisos.codigo),
      ),
    };
  }
}
