import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificacionDto {
  @ApiProperty({ example: 1, description: 'ID del usuario destinatario' })
  @Type(() => Number)
  @IsInt()
  usuario_id!: number;

  @ApiProperty({ example: 'INFO', description: 'Tipo de notificacion' })
  @IsString()
  @IsNotEmpty()
  tipo!: string;

  @ApiProperty({
    example: 'Nuevo mensaje',
    description: 'Titulo de la notificacion',
  })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({
    example: 'Tiene un nuevo mensaje asignado',
    description: 'Mensaje de la notificacion',
  })
  @IsString()
  @IsNotEmpty()
  mensaje!: string;

  @ApiPropertyOptional({
    example: { key: 'value' },
    description: 'Metadata adicional de la notificacion',
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
