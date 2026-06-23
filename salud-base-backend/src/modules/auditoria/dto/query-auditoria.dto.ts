import { IsInt, IsString, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/index.js';

export class QueryAuditoriaDto extends PaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Filtrar por ID de usuario' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  usuario_id?: number;

  @ApiPropertyOptional({
    example: 'LOGIN',
    description: 'Filtrar por tipo de evento',
  })
  @IsString()
  @IsOptional()
  tipo_evento?: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filtrar desde fecha (ISO 8601)',
  })
  @IsDateString()
  @IsOptional()
  fechaDesde?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Filtrar hasta fecha (ISO 8601)',
  })
  @IsDateString()
  @IsOptional()
  fechaHasta?: string;
}
