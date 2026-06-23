import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditoriaService } from './auditoria.service.js';
import { QueryAuditoriaDto } from './dto/query-auditoria.dto.js';
import { PaginationDto } from '../../common/dto/index.js';
import { ParseBigIntPipe } from '../../common/pipes/parse-bigint.pipe.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type {
  AuditoriaAccesos,
  AuditLog,
} from '../../../generated/prisma/client.js';

@ApiTags('auditoria')
@ApiBearerAuth()
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get('accesos')
  @ApiOperation({ summary: 'Listar registros de auditoria de accesos' })
  async findAllAccesos(
    @Query() query: QueryAuditoriaDto,
  ): Promise<PaginatedResponse<AuditoriaAccesos>> {
    return this.auditoriaService.findAllAccesos(query);
  }

  @Get('accesos/:id')
  @ApiOperation({
    summary: 'Obtener un registro de auditoria de acceso por ID',
  })
  async findOneAcceso(
    @Param('id', new ParseBigIntPipe()) id: bigint,
  ): Promise<AuditoriaAccesos> {
    return this.auditoriaService.findOneAcceso(id);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Listar logs de auditoria' })
  async findAllAuditLogs(
    @Query() query: PaginationDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    return this.auditoriaService.findAllAuditLogs(query);
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Obtener un log de auditoria por ID' })
  async findOneAuditLog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditLog> {
    return this.auditoriaService.findOneAuditLog(id);
  }
}
