import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RegionesService } from './regiones.service.js';
import { CreateRegionDto } from './dto/create-region.dto.js';
import { UpdateRegionDto } from './dto/update-region.dto.js';
import { QueryRegionDto } from './dto/query-region.dto.js';
import { CurrentUser, type AuthUser } from '../../common/decorators/index.js';
import type { Regiones } from '../../../generated/prisma/client.js';
import type { PaginatedResponse } from '../../common/dto/index.js';

@ApiTags('regiones')
@ApiBearerAuth()
@Controller('regiones')
export class RegionesController {
  constructor(private readonly regionesService: RegionesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar regiones con paginacion' })
  async findAll(
    @Query() query: QueryRegionDto,
  ): Promise<PaginatedResponse<Regiones>> {
    return this.regionesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una region por id incluyendo provincias' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Regiones> {
    return this.regionesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva region' })
  async create(
    @Body() dto: CreateRegionDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Regiones> {
    return this.regionesService.create(dto, user.usuario_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una region' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegionDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Regiones> {
    return this.regionesService.update(id, dto, user.usuario_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una region (eliminacion logica)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.regionesService.remove(id);
  }
}
