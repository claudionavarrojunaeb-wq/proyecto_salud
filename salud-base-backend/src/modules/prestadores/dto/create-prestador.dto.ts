import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrestadorDto {
  @ApiProperty({ example: '12345678-9', description: 'RUT del prestador' })
  @IsString()
  @IsNotEmpty()
  rut!: string;

  @ApiProperty({
    example: 'Centro Medico Example',
    description: 'Razon social del prestador',
  })
  @IsString()
  @IsNotEmpty()
  razon_social!: string;

  @ApiPropertyOptional({
    example: 'Av. Principal 123',
    description: 'Direccion del prestador',
  })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID de la comuna' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  comuna_id?: number;

  @ApiPropertyOptional({
    example: '+56912345678',
    description: 'Telefono del prestador',
  })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'contacto@prestador.cl',
    description: 'Email del prestador',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Indica si el prestador esta activo',
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean = true;
}
