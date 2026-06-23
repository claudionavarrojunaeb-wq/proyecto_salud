import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermisoDto {
  @ApiProperty({
    example: 'usuarios:read',
    description: 'Codigo unico del permiso',
  })
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @ApiProperty({
    example: 'usuarios',
    description: 'Modulo al que pertenece el permiso',
  })
  @IsString()
  @IsNotEmpty()
  modulo!: string;

  @ApiProperty({ example: 'read', description: 'Accion del permiso' })
  @IsString()
  @IsNotEmpty()
  accion!: string;

  @ApiPropertyOptional({
    example: 'Leer usuarios',
    description: 'Descripcion del permiso',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Permiso activo',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean = true;
}
