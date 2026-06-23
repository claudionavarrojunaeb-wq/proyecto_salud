import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PermisosService } from './permisos.service.js';
import { CreatePermisoDto } from './dto/create-permiso.dto.js';
import { UpdatePermisoDto } from './dto/update-permiso.dto.js';
import { QueryPermisoDto } from './dto/query-permiso.dto.js';
import { CurrentUser } from '../../common/decorators/index.js';
import type { AuthUser } from '../../common/decorators/index.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { Permisos } from '../../../generated/prisma/client.js';

@ApiTags('permisos')
@ApiBearerAuth()
@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar permisos paginados' })
  async findAll(
    @Query() query: QueryPermisoDto,
  ): Promise<PaginatedResponse<Permisos>> {
    return this.permisosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener permiso por id' })
  async findOne(@Param('id') id: string): Promise<Permisos> {
    return this.permisosService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear permiso' })
  async create(
    @Body() dto: CreatePermisoDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Permisos> {
    return this.permisosService.create(dto, user.usuario_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar permiso' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePermisoDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Permisos> {
    return this.permisosService.update(Number(id), dto, user.usuario_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar permiso (soft delete)' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.permisosService.remove(Number(id));
  }
}
