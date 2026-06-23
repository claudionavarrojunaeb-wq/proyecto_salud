import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComunaDto {
  @ApiProperty({ example: 'Iquique', description: 'Nombre de la comuna' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 1,
    description: 'Id de la provincia a la que pertenece',
  })
  @IsInt()
  @Type(() => Number)
  provincia_id!: number;

  @ApiProperty({ example: '01101', description: 'Codigo de la comuna' })
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @ApiPropertyOptional({
    default: true,
    description: 'Indica si la comuna esta activa',
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
