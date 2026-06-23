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
import { ProvinciasService } from './provincias.service.js';
import { CreateProvinciaDto } from './dto/create-provincia.dto.js';
import { UpdateProvinciaDto } from './dto/update-provincia.dto.js';
import { QueryProvinciaDto } from './dto/query-provincia.dto.js';
import { CurrentUser, type AuthUser } from '../../common/decorators/index.js';
import type { Provincias } from '../../../generated/prisma/client.js';
import type { PaginatedResponse } from '../../common/dto/index.js';

@ApiTags('provincias')
@ApiBearerAuth()
@Controller('provincias')
export class ProvinciasController {
  constructor(private readonly provinciasService: ProvinciasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar provincias con paginacion' })
  async findAll(
    @Query() query: QueryProvinciaDto,
  ): Promise<PaginatedResponse<Provincias>> {
    return this.provinciasService.findAll(query);
  }

  @Get('region/:regionId')
  @ApiOperation({ summary: 'Listar provincias por region' })
  async findByRegion(
    @Param('regionId', ParseIntPipe) regionId: number,
  ): Promise<Provincias[]> {
    return this.provinciasService.findByRegion(regionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una provincia por id incluyendo comunas' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Provincias> {
    return this.provinciasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva provincia' })
  async create(
    @Body() dto: CreateProvinciaDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Provincias> {
    return this.provinciasService.create(dto, user.usuario_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una provincia' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProvinciaDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Provincias> {
    return this.provinciasService.update(id, dto, user.usuario_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una provincia (eliminacion logica)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.provinciasService.remove(id);
  }
}
