import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { Prisma, Provincias } from '../../../generated/prisma/client.js';
import { CreateProvinciaDto } from './dto/create-provincia.dto.js';
import { UpdateProvinciaDto } from './dto/update-provincia.dto.js';
import { QueryProvinciaDto } from './dto/query-provincia.dto.js';

@Injectable()
export class ProvinciasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: QueryProvinciaDto,
  ): Promise<PaginatedResponse<Provincias>> {
    const where: Prisma.ProvinciasWhereInput = {};
    if (query.region_id !== undefined) {
      where.region_id = query.region_id;
    }
    if (query.activo !== undefined) {
      where.activo = query.activo;
    }

    const orderBy: Prisma.ProvinciasOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { nombre: 'asc' };

    const [data, total] = await Promise.all([
      this.prisma.provincias.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.provincias.count({ where }),
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

  findByRegion(regionId: number): Promise<Provincias[]> {
    return this.prisma.provincias.findMany({
      where: { region_id: regionId },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number): Promise<Provincias> {
    const provincia = await this.prisma.provincias.findUnique({
      where: { provincia_id: id },
      include: { Comunas: true },
    });
    if (!provincia) {
      throw new NotFoundException(`Provincia con id ${id} no encontrada`);
    }
    return provincia;
  }

  async create(data: CreateProvinciaDto, userId: number): Promise<Provincias> {
    return this.prisma.provincias.create({
      data: {
        nombre: data.nombre,
        region_id: data.region_id,
        codigo: data.codigo,
        activo: data.activo ?? true,
        creado_por: userId,
      } as Prisma.ProvinciasUncheckedCreateInput,
    });
  }

  async update(
    id: number,
    data: UpdateProvinciaDto,
    userId: number,
  ): Promise<Provincias> {
    await this.findOne(id);
    return this.prisma.provincias.update({
      where: { provincia_id: id },
      data: {
        ...data,
        modificado_por: userId,
        fecha_modificacion: new Date(),
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.provincias.update({
      where: { provincia_id: id },
      data: { activo: false },
    });
  }
}
