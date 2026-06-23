import { PartialType } from '@nestjs/mapped-types';
import { CreatePrestadorDto } from './create-prestador.dto.js';

export class UpdatePrestadorDto extends PartialType(CreatePrestadorDto) {}
