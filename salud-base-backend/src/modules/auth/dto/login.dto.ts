import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '12345678-9', description: 'RUT del usuario' })
  @IsString()
  @IsNotEmpty()
  rut!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contrasena del usuario',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
