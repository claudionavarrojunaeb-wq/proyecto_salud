import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/index.js';

export class QueryPermisoDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por modulo (coincidencia parcial)',
  })
  @IsString()
  @IsOptional()
  modulo?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo' })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
