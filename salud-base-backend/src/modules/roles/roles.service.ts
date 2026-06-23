import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { UpdateRolDto } from './dto/update-rol.dto.js';
import { QueryRolDto } from './dto/query-rol.dto.js';
import type { Prisma, Roles } from '../../../generated/prisma/client.js';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryRolDto): Promise<PaginatedResponse<Roles>> {
    const where: Prisma.RolesWhereInput = {};
    if (query.codigo) where.codigo = { contains: query.codigo };
    if (query.activo !== undefined) where.activo = query.activo;

    const orderBy: Prisma.RolesOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder ?? 'asc' }
      : { fecha_creacion: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.roles.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.roles.count({ where }),
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

  async findOne(id: number): Promise<Roles> {
    const rol = await this.prisma.roles.findUnique({ where: { rol_id: id } });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    return rol;
  }

  async create(data: CreateRolDto, userId: number): Promise<Roles> {
    return this.prisma.roles.create({
      data: {
        ...data,
        creado_por: userId,
      } as unknown as Prisma.RolesUncheckedCreateInput,
    });
  }

  async update(id: number, data: UpdateRolDto, userId: number): Promise<Roles> {
    return this.prisma.roles.update({
      where: { rol_id: id },
      data: {
        ...data,
        modificado_por: userId,
        fecha_modificacion: new Date(),
      },
    });
  }

  async remove(id: number): Promise<void> {
    const rol = await this.prisma.roles.findUnique({ where: { rol_id: id } });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    await this.prisma.roles.update({
      where: { rol_id: id },
      data: { activo: false },
    });
  }

  async assignPermisos(rolId: number, permisoIds: number[]): Promise<void> {
    const rol = await this.prisma.roles.findUnique({
      where: { rol_id: rolId },
    });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${rolId} no encontrado`);
    }
    await this.prisma.rolesPermisos.createMany({
      data: permisoIds.map((permiso_id) => ({ rol_id: rolId, permiso_id })),
      skipDuplicates: true,
    });
  }
}
