import { Module } from '@nestjs/common';
import { ComunasController } from './comunas.controller.js';
import { ComunasService } from './comunas.service.js';

@Module({
  controllers: [ComunasController],
  providers: [ComunasService],
  exports: [ComunasService],
})
export class ComunasModule {}
