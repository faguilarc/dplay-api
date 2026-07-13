import { Module } from '@nestjs/common';
import { ParletService } from './parlet.service.js';
import { ParletController } from './parlet.controller.js';

@Module({
  controllers: [ParletController],
  providers: [ParletService],
})
export class ParletModule {}