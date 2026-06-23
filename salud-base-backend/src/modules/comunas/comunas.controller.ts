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
import { ComunasService } from './comunas.service.js';
import { CreateComunaDto } from './dto/create-comuna.dto.js';
import { UpdateComunaDto } from './dto/update-comuna.dto.js';
import { QueryComunaDto } from './dto/query-comuna.dto.js';
import { CurrentUser, type AuthUser } from '../../common/decorators/index.js';
import type { Comunas } from '../../../generated/prisma/client.js';
import type { PaginatedResponse } from '../../common/dto/index.js';

@ApiTags('comunas')
@ApiBearerAuth()
@Controller('comunas')
export class ComunasController {
  constructor(private readonly comunasService: ComunasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar comunas con paginacion' })
  async findAll(
    @Query() query: QueryComunaDto,
  ): Promise<PaginatedResponse<Comunas>> {
    return this.comunasService.findAll(query);
  }

  @Get('provincia/:provinciaId')
  @ApiOperation({ summary: 'Listar comunas por provincia' })
  async findByProvincia(
    @Param('provinciaId', ParseIntPipe) provinciaId: number,
  ): Promise<Comunas[]> {
    return this.comunasService.findByProvincia(provinciaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una comuna por id incluyendo provincia' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Comunas> {
    return this.comunasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva comuna' })
  async create(
    @Body() dto: CreateComunaDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Comunas> {
    return this.comunasService.create(dto, user.usuario_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una comuna' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateComunaDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Comunas> {
    return this.comunasService.update(id, dto, user.usuario_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una comuna (eliminacion logica)' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.comunasService.remove(id);
  }
}
