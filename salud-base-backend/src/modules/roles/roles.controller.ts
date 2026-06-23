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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { RolesService } from './roles.service.js';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { UpdateRolDto } from './dto/update-rol.dto.js';
import { QueryRolDto } from './dto/query-rol.dto.js';
import { CurrentUser } from '../../common/decorators/index.js';
import type { AuthUser } from '../../common/decorators/index.js';
import type { PaginatedResponse } from '../../common/dto/index.js';
import type { Roles } from '../../../generated/prisma/client.js';

class AssignPermisosDto {
  @ApiProperty({
    type: [Number],
    description: 'IDs de permisos a asignar al rol',
  })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  permisoIds!: number[];
}

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar roles paginados' })
  async findAll(
    @Query() query: QueryRolDto,
  ): Promise<PaginatedResponse<Roles>> {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener rol por id' })
  async findOne(@Param('id') id: string): Promise<Roles> {
    return this.rolesService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear rol' })
  async create(
    @Body() dto: CreateRolDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Roles> {
    return this.rolesService.create(dto, user.usuario_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar rol' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRolDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Roles> {
    return this.rolesService.update(Number(id), dto, user.usuario_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar rol (soft delete)' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.rolesService.remove(Number(id));
  }

  @Post(':id/permisos')
  @ApiOperation({ summary: 'Asignar permisos a un rol' })
  async assignPermisos(
    @Param('id') id: string,
    @Body() dto: AssignPermisosDto,
  ): Promise<void> {
    await this.rolesService.assignPermisos(Number(id), dto.permisoIds);
  }
}
