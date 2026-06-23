import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRolDto {
  @ApiProperty({ example: 'ADMIN', description: 'Codigo unico del rol' })
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @ApiProperty({ example: 'Administrador', description: 'Nombre del rol' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional({
    example: 'Rol de administrador del sistema',
    description: 'Descripcion del rol',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    example: 'NACIONAL',
    description: 'Contexto requerido por el rol',
  })
  @IsString()
  @IsNotEmpty()
  requiere_contexto!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Rol activo',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean = true;
}
