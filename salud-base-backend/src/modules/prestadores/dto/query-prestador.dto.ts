import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/index.js';

export class QueryPrestadorDto extends PaginationDto {
  @ApiPropertyOptional({
    example: '12345678',
    description: 'Filtrar por RUT (coincidencia parcial)',
  })
  @IsString()
  @IsOptional()
  rut?: string;

  @ApiPropertyOptional({ example: 1, description: 'Filtrar por ID de comuna' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  comuna_id?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtrar por estado activo',
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
