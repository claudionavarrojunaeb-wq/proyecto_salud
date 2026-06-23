import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import { CreatePermisoDto } from './dto/create-permiso.dto.js';
import { UpdatePermisoDto } from './dto/update-permiso.dto.js';
import { QueryPermisoDto } from './dto/query-permiso.dto.js';
import type { Prisma, Permisos } from '../../../generated/prisma/client.js';

@Injectable()
export class PermisosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPermisoDto): Promise<PaginatedResponse<Permisos>> {
    const where: Prisma.PermisosWhereInput = {};
    if (query.modulo) where.modulo = { contains: query.modulo };
    if (query.activo !== undefined) where.activo = query.activo;

    const orderBy: Prisma.PermisosOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder ?? 'asc' }
      : { fecha_creacion: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.permisos.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.permisos.count({ where }),
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

  async findOne(id: number): Promise<Permisos> {
    const permiso = await this.prisma.permisos.findUnique({
      where: { permiso_id: id },
    });
    if (!permiso) {
      throw new NotFoundException(`Permiso con id ${id} no encontrado`);
    }
    return permiso;
  }

  async create(data: CreatePermisoDto, userId: number): Promise<Permisos> {
    return this.prisma.permisos.create({
      data: {
        ...data,
        creado_por: userId,
      } as unknown as Prisma.PermisosUncheckedCreateInput,
    });
  }

  async update(
    id: number,
    data: UpdatePermisoDto,
    userId: number,
  ): Promise<Permisos> {
    return this.prisma.permisos.update({
      where: { permiso_id: id },
      data: {
        ...data,
        modificado_por: userId,
        fecha_modificacion: new Date(),
      },
    });
  }

  async remove(id: number): Promise<void> {
    const permiso = await this.prisma.permisos.findUnique({
      where: { permiso_id: id },
    });
    if (!permiso) {
      throw new NotFoundException(`Permiso con id ${id} no encontrado`);
    }
    await this.prisma.permisos.update({
      where: { permiso_id: id },
      data: { activo: false },
    });
  }
}
