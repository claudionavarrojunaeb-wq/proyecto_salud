import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { Prestadores, Prisma } from '../../../generated/prisma/client.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { CreatePrestadorDto } from './dto/create-prestador.dto.js';
import type { UpdatePrestadorDto } from './dto/update-prestador.dto.js';
import type { QueryPrestadorDto } from './dto/query-prestador.dto.js';

@Injectable()
export class PrestadoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: QueryPrestadorDto,
  ): Promise<PaginatedResponse<Prestadores>> {
    const where: Prisma.PrestadoresWhereInput = {};
    if (query.rut) {
      where.rut = { contains: query.rut };
    }
    if (query.comuna_id !== undefined) {
      where.comuna_id = query.comuna_id;
    }
    if (query.activo !== undefined) {
      where.activo = query.activo;
    }

    const orderBy: Prisma.PrestadoresOrderByWithRelationInput = query.sortBy
      ? {
          [query.sortBy]: query.sortOrder,
        }
      : { fecha_creacion: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.prestadores.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
        include: { Comunas: true },
      }),
      this.prisma.prestadores.count({ where }),
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

  async findOne(id: number): Promise<Prestadores> {
    const prestador = await this.prisma.prestadores.findUnique({
      where: { prestador_id: id },
      include: { Comunas: true },
    });

    if (!prestador) {
      throw new NotFoundException(`Prestador con ID ${id} no encontrado`);
    }

    return prestador;
  }

  async create(data: CreatePrestadorDto, userId: number): Promise<Prestadores> {
    return this.prisma.prestadores.create({
      data: {
        rut: data.rut,
        razon_social: data.razon_social,
        direccion: data.direccion,
        comuna_id: data.comuna_id,
        telefono: data.telefono,
        email: data.email,
        activo: data.activo ?? true,
        creado_por: userId,
      } as never,
    });
  }

  async update(
    id: number,
    data: UpdatePrestadorDto,
    userId: number,
  ): Promise<Prestadores> {
    return this.prisma.prestadores.update({
      where: { prestador_id: id },
      data: {
        ...data,
        modificado_por: userId,
        fecha_modificacion: new Date(),
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.prestadores.update({
      where: { prestador_id: id },
      data: { activo: false },
    });
  }
}
