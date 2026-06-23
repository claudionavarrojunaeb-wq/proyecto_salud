import { IsInt, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/index.js';

export class QueryProvinciaDto extends PaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Filtrar por id de region' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  region_id?: number;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
