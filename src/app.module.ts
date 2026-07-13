import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from './config/config.module.js';
import { JugadasModule } from './jugadas/jugadas.module.js';
import { ResultadosModule } from './resultados/resultados.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { PerfilModule } from './perfil/perfil.module.js';
import { NotificacionesModule } from './notificaciones/notificaciones.module.js';
import { ParletModule } from './parlet/parlet.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule,
    JugadasModule,
    ResultadosModule,
    TicketsModule,
    PerfilModule,
    NotificacionesModule,
    ParletModule,
  ],
})
export class AppModule {}