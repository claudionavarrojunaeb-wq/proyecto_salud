import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty({ example: '01', description: 'Codigo de la region' })
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @ApiProperty({ example: 'Tarapaca', description: 'Nombre de la region' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional({
    example: 'I',
    description: 'Abreviatura de la region',
  })
  @IsString()
  @IsOptional()
  abreviatura?: string;

  @ApiPropertyOptional({ example: 1, description: 'Orden de visualizacion' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orden_visual?: number;

  @ApiPropertyOptional({
    default: true,
    description: 'Indica si la region esta activa',
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
