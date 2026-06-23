import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '12345678-9', description: 'RUT del usuario' })
  @IsString()
  @IsNotEmpty()
  rut!: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres del usuario' })
  @IsString()
  @IsNotEmpty()
  nombres!: string;

  @ApiProperty({ example: 'Perez', description: 'Primer apellido' })
  @IsString()
  @IsNotEmpty()
  primer_apellido!: string;

  @ApiPropertyOptional({ example: 'Gonzalez', description: 'Segundo apellido' })
  @IsString()
  @IsOptional()
  segundo_apellido?: string;

  @ApiProperty({ example: 'INTERNO', description: 'Tipo de usuario' })
  @IsString()
  @IsNotEmpty()
  tipo_usuario!: string;

  @ApiProperty({
    example: 'juan.perez@junaeb.cl',
    description: 'Correo electronico',
  })
  @IsEmail()
  correo_electronico!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contrasena (minimo 8 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
