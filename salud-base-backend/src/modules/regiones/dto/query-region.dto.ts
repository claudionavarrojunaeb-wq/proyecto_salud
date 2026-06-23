import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/index.js';

export class QueryRegionDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filtrar por codigo de region' })
  @IsString()
  @IsOptional()
  codigo?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
