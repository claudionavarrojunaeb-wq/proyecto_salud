import { Module } from '@nestjs/common';
import { RegionesController } from './regiones.controller.js';
import { RegionesService } from './regiones.service.js';

@Module({
  controllers: [RegionesController],
  providers: [RegionesService],
  exports: [RegionesService],
})
export class RegionesModule {}
