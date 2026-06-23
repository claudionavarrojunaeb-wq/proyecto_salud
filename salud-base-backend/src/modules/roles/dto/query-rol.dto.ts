import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/index.js';

export class QueryRolDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por codigo (coincidencia parcial)',
  })
  @IsString()
  @IsOptional()
  codigo?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo' })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
