import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { Prisma, Regiones } from '../../../generated/prisma/client.js';
import { CreateRegionDto } from './dto/create-region.dto.js';
import { UpdateRegionDto } from './dto/update-region.dto.js';
import { QueryRegionDto } from './dto/query-region.dto.js';

@Injectable()
export class RegionesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryRegionDto): Promise<PaginatedResponse<Regiones>> {
    const where: Prisma.RegionesWhereInput = {};
    if (query.codigo) {
      where.codigo = { contains: query.codigo };
    }
    if (query.activo !== undefined) {
      where.activo = query.activo;
    }

    const orderBy: Prisma.RegionesOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { orden_visual: 'asc' };

    const [data, total] = await Promise.all([
      this.prisma.regiones.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.regiones.count({ where }),
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

  async findOne(id: number): Promise<Regiones> {
    const region = await this.prisma.regiones.findUnique({
      where: { region_id: id },
      include: { Provincias: true },
    });
    if (!region) {
      throw new NotFoundException(`Region con id ${id} no encontrada`);
    }
    return region;
  }

  async create(data: CreateRegionDto, userId: number): Promise<Regiones> {
    return this.prisma.regiones.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        abreviatura: data.abreviatura,
        orden_visual: data.orden_visual,
        activo: data.activo ?? true,
        creado_por: userId,
      } as Prisma.RegionesUncheckedCreateInput,
    });
  }

  async update(
    id: number,
    data: UpdateRegionDto,
    userId: number,
  ): Promise<Regiones> {
    await this.findOne(id);
    return this.prisma.regiones.update({
      where: { region_id: id },
      data: {
        ...data,
        modificado_por: userId,
        fecha_modificacion: new Date(),
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.regiones.update({
      where: { region_id: id },
      data: { activo: false },
    });
  }
}
