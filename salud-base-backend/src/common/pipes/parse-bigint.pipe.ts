import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException('El ID es requerido');
    }

    try {
      return BigInt(value);
    } catch {
      throw new BadRequestException(
        `El valor "${value}" no es un BigInt valido`,
      );
    }
  }
}
