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
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { QueryUsuarioDto } from './dto/query-usuario.dto.js';
import { CurrentUser } from '../../common/decorators/index.js';
import type { AuthUser } from '../../common/decorators/index.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { Usuarios } from '../../../generated/prisma/client.js';

@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios paginados' })
  async findAll(
    @Query() query: QueryUsuarioDto,
  ): Promise<PaginatedResponse<Usuarios>> {
    return this.usuariosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por id' })
  async findOne(@Param('id') id: string): Promise<Usuarios> {
    return this.usuariosService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  async create(
    @Body() dto: CreateUsuarioDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Usuarios> {
    return this.usuariosService.create(dto, user.usuario_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUsuarioDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Usuarios> {
    return this.usuariosService.update(Number(id), dto, user.usuario_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar usuario (soft delete)' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usuariosService.remove(Number(id));
  }
}
