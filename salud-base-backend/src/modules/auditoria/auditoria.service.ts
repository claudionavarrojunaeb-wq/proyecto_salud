import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import type {
  AuditoriaAccesos,
  AuditLog,
  Prisma,
} from '../../../generated/prisma/client.js';
import type {
  PaginationDto,
  PaginatedResponse,
} from '../../common/dto/index.js';
import type { QueryAuditoriaDto } from './dto/query-auditoria.dto.js';

@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAccesos(
    query: QueryAuditoriaDto,
  ): Promise<PaginatedResponse<AuditoriaAccesos>> {
    const where: Prisma.AuditoriaAccesosWhereInput = {};
    if (query.usuario_id !== undefined) {
      where.usuario_id = query.usuario_id;
    }
    if (query.tipo_evento) {
      where.tipo_evento = query.tipo_evento;
    }

    const fechaEvento: { gte?: Date; lte?: Date } = {};
    if (query.fechaDesde) {
      fechaEvento.gte = new Date(query.fechaDesde);
    }
    if (query.fechaHasta) {
      fechaEvento.lte = new Date(query.fechaHasta);
    }
    if (fechaEvento.gte || fechaEvento.lte) {
      where.fecha_evento = fechaEvento;
    }

    const orderBy: Prisma.AuditoriaAccesosOrderByWithRelationInput =
      query.sortBy
        ? {
            [query.sortBy]: query.sortOrder,
          }
        : { fecha_evento: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.auditoriaAccesos.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.auditoriaAccesos.count({ where }),
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

  async findOneAcceso(id: bigint): Promise<AuditoriaAccesos> {
    const acceso = await this.prisma.auditoriaAccesos.findUnique({
      where: { log_id: BigInt(id) },
    });

    if (!acceso) {
      throw new NotFoundException(
        `Registro de auditoria con ID ${id} no encontrado`,
      );
    }

    return acceso;
  }

  async findAllAuditLogs(
    query: PaginationDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    const orderBy: Prisma.AuditLogOrderByWithRelationInput = query.sortBy
      ? {
          [query.sortBy]: query.sortOrder,
        }
      : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.auditLog.count(),
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

  async findOneAuditLog(id: number): Promise<AuditLog> {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new NotFoundException(`Log con ID ${id} no encontrado`);
    }

    return log;
  }
}
