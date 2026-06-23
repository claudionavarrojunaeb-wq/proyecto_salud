import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { QueryUsuarioDto } from './dto/query-usuario.dto.js';
import type { Prisma, Usuarios } from '../../../generated/prisma/client.js';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryUsuarioDto): Promise<PaginatedResponse<Usuarios>> {
    const where: Prisma.UsuariosWhereInput = {};
    if (query.rut) where.rut = { contains: query.rut };
    if (query.activo !== undefined) where.activo = query.activo;
    if (query.tipo_usuario) where.tipo_usuario = query.tipo_usuario;

    const orderBy: Prisma.UsuariosOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder ?? 'asc' }
      : { fecha_creacion: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.usuarios.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.usuarios.count({ where }),
    ]);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Usuarios> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { usuario_id: id },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  async create(data: CreateUsuarioDto, userId: number): Promise<Usuarios> {
    const { password, ...rest } = data;
    const password_hash = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    return this.prisma.usuarios.create({
      data: {
        ...rest,
        ...(password_hash ? { password_hash } : {}),
        creado_por: userId,
      } as unknown as Prisma.UsuariosUncheckedCreateInput,
    });
  }

  async update(
    id: number,
    data: UpdateUsuarioDto,
    userId: number,
  ): Promise<Usuarios> {
    const { password, ...rest } = data;
    const password_hash = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    return this.prisma.usuarios.update({
      where: { usuario_id: id },
      data: {
        ...rest,
        ...(password_hash ? { password_hash } : {}),
        modificado_por: userId,
        fecha_modificacion: new Date(),
      },
    });
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { usuario_id: id },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.prisma.usuarios.update({
      where: { usuario_id: id },
      data: { activo: false },
    });
  }
}
