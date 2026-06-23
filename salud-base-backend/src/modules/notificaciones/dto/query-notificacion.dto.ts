import { IsInt, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/index.js';

export class QueryNotificacionDto extends PaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Filtrar por ID de usuario' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  usuario_id?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Filtrar por estado de lectura',
  })
  @IsBoolean()
  @IsOptional()
  leida?: boolean;

  @ApiPropertyOptional({
    example: 'INFO',
    description: 'Filtrar por tipo de notificacion',
  })
  @IsString()
  @IsOptional()
  tipo?: string;
}
