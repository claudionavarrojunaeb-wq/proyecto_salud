import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProvinciaDto {
  @ApiProperty({ example: 'Iquique', description: 'Nombre de la provincia' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 1,
    description: 'Id de la region a la que pertenece',
  })
  @IsInt()
  @Type(() => Number)
  region_id!: number;

  @ApiProperty({ example: '011', description: 'Codigo de la provincia' })
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @ApiPropertyOptional({
    default: true,
    description: 'Indica si la provincia esta activa',
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
