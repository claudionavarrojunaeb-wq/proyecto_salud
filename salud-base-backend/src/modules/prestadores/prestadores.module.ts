import { Module } from '@nestjs/common';
import { PrestadoresController } from './prestadores.controller.js';
import { PrestadoresService } from './prestadores.service.js';

@Module({
  controllers: [PrestadoresController],
  providers: [PrestadoresService],
  exports: [PrestadoresService],
})
export class PrestadoresModule {}
