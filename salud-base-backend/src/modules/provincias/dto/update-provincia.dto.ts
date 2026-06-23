import { PartialType } from '@nestjs/mapped-types';
import { CreateProvinciaDto } from './create-provincia.dto.js';

export class UpdateProvinciaDto extends PartialType(CreateProvinciaDto) {}
