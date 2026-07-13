import { Module } from '@nestjs/common';
import { JugadasService } from './jugadas.service.js';
import { JugadasController } from './jugadas.controller.js';

@Module({
  controllers: [JugadasController],
  providers: [JugadasService],
})
export class JugadasModule {}