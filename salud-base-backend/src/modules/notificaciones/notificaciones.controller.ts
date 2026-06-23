import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service.js';
import { CreateNotificacionDto } from './dto/create-notificacion.dto.js';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto.js';
import { QueryNotificacionDto } from './dto/query-notificacion.dto.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { Notificaciones } from '../../../generated/prisma/client.js';

@ApiTags('notificaciones')
@ApiBearerAuth()
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones con paginacion y filtros' })
  async findAll(
    @Query() query: QueryNotificacionDto,
  ): Promise<PaginatedResponse<Notificaciones>> {
    return this.notificacionesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificacion por ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Notificaciones> {
    return this.notificacionesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificacion' })
  async create(@Body() dto: CreateNotificacionDto): Promise<Notificaciones> {
    return this.notificacionesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una notificacion' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificacionDto,
  ): Promise<Notificaciones> {
    return this.notificacionesService.update(id, dto);
  }

  @Patch(':id/leida')
  @ApiOperation({ summary: 'Marcar una notificacion como leida' })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Notificaciones> {
    return this.notificacionesService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificacion' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.notificacionesService.remove(id);
  }
}
