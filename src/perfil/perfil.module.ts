import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service.js';
import { PerfilController } from './perfil.controller.js';

@Module({
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}