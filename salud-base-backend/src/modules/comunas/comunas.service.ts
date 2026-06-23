import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { Prisma, Comunas } from '../../../generated/prisma/client.js';
import { CreateComunaDto } from './dto/create-comuna.dto.js';
import { UpdateComunaDto } from './dto/update-comuna.dto.js';
import { QueryComunaDto } from './dto/query-comuna.dto.js';

@Injectable()
export class ComunasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryComunaDto): Promise<PaginatedResponse<Comunas>> {
    const where: Prisma.ComunasWhereInput = {};
    if (query.provincia_id !== undefined) {
      where.provincia_id = query.provincia_id;
    }
    if (query.activo !== undefined) {
      where.activo = query.activo;
    }

    const orderBy: Prisma.ComunasOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { nombre: 'asc' };

    const [data, total] = await Promise.all([
      this.prisma.comunas.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.comunas.count({ where }),
    ]);

    const limit = query.take;

    return {
      data,
      meta: {
        total,
        page: query.page ?? 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findByProvincia(provinciaId: number): Promise<Comunas[]> {
    return this.prisma.comunas.findMany({
      where: { provincia_id: provinciaId },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number): Promise<Comunas> {
    const comuna = await this.prisma.comunas.findUnique({
      where: { comuna_id: id },
      include: { Provincias: true },
    });
    if (!comuna) {
      throw new NotFoundException(`Comuna con id ${id} no encontrada`);
    }
    return comuna;
  }

  async create(data: CreateComunaDto, userId: number): Promise<Comunas> {
    return this.prisma.comunas.create({
      data: {
        nombre: data.nombre,
        provincia_id: data.provincia_id,
        codigo: data.codigo,
        activo: data.activo ?? true,
        creado_por: userId,
      } as Prisma.ComunasUncheckedCreateInput,
    });
  }

  async update(
    id: number,
    data: UpdateComunaDto,
    userId: number,
  ): Promise<Comunas> {
    await this.findOne(id);
    return this.prisma.comunas.update({
      where: { comuna_id: id },
      data: {
        ...data,
        modificado_por: userId,
        fecha_modificacion: new Date(),
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.comunas.update({
      where: { comuna_id: id },
      data: { activo: false },
    });
  }
}
