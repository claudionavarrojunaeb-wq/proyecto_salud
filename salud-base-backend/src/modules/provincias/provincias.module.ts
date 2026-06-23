import { Module } from '@nestjs/common';
import { ProvinciasController } from './provincias.controller.js';
import { ProvinciasService } from './provincias.service.js';

@Module({
  controllers: [ProvinciasController],
  providers: [ProvinciasService],
  exports: [ProvinciasService],
})
export class ProvinciasModule {}
