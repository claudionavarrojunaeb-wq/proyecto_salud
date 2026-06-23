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
import { PrestadoresService } from './prestadores.service.js';
import { CreatePrestadorDto } from './dto/create-prestador.dto.js';
import { UpdatePrestadorDto } from './dto/update-prestador.dto.js';
import { QueryPrestadorDto } from './dto/query-prestador.dto.js';
import { CurrentUser } from '../../common/decorators/index.js';
import type { AuthUser } from '../../common/decorators/index.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { Prestadores } from '../../../generated/prisma/client.js';

@ApiTags('prestadores')
@ApiBearerAuth()
@Controller('prestadores')
export class PrestadoresController {
  constructor(private readonly prestadoresService: PrestadoresService) {}

  @Get()
  @ApiOperation({ summary: 'Listar prestadores con paginacion y filtros' })
  async findAll(
    @Query() query: QueryPrestadorDto,
  ): Promise<PaginatedResponse<Prestadores>> {
    return this.prestadoresService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un prestador por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Prestadores> {
    return this.prestadoresService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo prestador' })
  async create(
    @Body() dto: CreatePrestadorDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Prestadores> {
    return this.prestadoresService.create(dto, user.usuario_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un prestador' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrestadorDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Prestadores> {
    return this.prestadoresService.update(id, dto, user.usuario_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un prestador (soft delete)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.prestadoresService.remove(id);
  }
}
