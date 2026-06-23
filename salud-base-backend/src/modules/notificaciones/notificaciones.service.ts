import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type {
  Notificaciones,
  Prisma,
} from '../../../generated/prisma/client.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { CreateNotificacionDto } from './dto/create-notificacion.dto.js';
import type { UpdateNotificacionDto } from './dto/update-notificacion.dto.js';
import type { QueryNotificacionDto } from './dto/query-notificacion.dto.js';

@Injectable()
export class NotificacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: QueryNotificacionDto,
  ): Promise<PaginatedResponse<Notificaciones>> {
    const where: Prisma.NotificacionesWhereInput = {};
    if (query.usuario_id !== undefined) {
      where.usuario_id = query.usuario_id;
    }
    if (query.leida !== undefined) {
      where.leida = query.leida;
    }
    if (query.tipo) {
      where.tipo = query.tipo;
    }

    const orderBy: Prisma.NotificacionesOrderByWithRelationInput = query.sortBy
      ? {
          [query.sortBy]: query.sortOrder,
        }
      : { fecha_creacion: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.notificaciones.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.notificaciones.count({ where }),
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

  async findOne(id: number): Promise<Notificaciones> {
    const notificacion = await this.prisma.notificaciones.findUnique({
      where: { notificacion_id: id },
    });

    if (!notificacion) {
      throw new NotFoundException(`Notificacion con ID ${id} no encontrada`);
    }

    return notificacion;
  }

  async create(data: CreateNotificacionDto): Promise<Notificaciones> {
    return this.prisma.notificaciones.create({
      data: {
        usuario_id: data.usuario_id,
        tipo: data.tipo,
        titulo: data.titulo,
        mensaje: data.mensaje,
        metadata: data.metadata,
      } as never,
    });
  }

  async update(
    id: number,
    data: UpdateNotificacionDto,
  ): Promise<Notificaciones> {
    return this.prisma.notificaciones.update({
      where: { notificacion_id: id },
      data: data as never,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.notificaciones.delete({
      where: { notificacion_id: id },
    });
  }

  async markAsRead(id: number): Promise<Notificaciones> {
    const notificacion = await this.prisma.notificaciones.findUnique({
      where: { notificacion_id: id },
    });

    if (!notificacion) {
      throw new NotFoundException(`Notificacion con ID ${id} no encontrada`);
    }

    return this.prisma.notificaciones.update({
      where: { notificacion_id: id },
      data: { leida: true },
    });
  }
}
