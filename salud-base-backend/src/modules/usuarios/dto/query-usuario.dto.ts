import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/index.js';

export class QueryUsuarioDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por RUT (coincidencia parcial)',
  })
  @IsString()
  @IsOptional()
  rut?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo' })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por tipo de usuario' })
  @IsString()
  @IsOptional()
  tipo_usuario?: string;
}
