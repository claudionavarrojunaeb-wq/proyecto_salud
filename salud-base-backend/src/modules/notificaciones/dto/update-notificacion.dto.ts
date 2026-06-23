import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificacionDto } from './create-notificacion.dto.js';

export class UpdateNotificacionDto extends PartialType(CreateNotificacionDto) {}
