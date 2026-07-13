import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotificacionesService {
  constructor(private prisma: PrismaService) {}

  async listarNotificacion(idUsuario: number) {
    const notificaciones = await this.prisma.notificacion.findMany({
      where: { usuarioId: idUsuario },
      orderBy: { fecha: 'desc' },
    });

    return {
      ok: true,
      data: notificaciones,
    };
  }

  async notificacionLeida(idNotificacion: number) {
    const notificacion = await this.prisma.notificacion.findUnique({
      where: { id: idNotificacion },
    });

    if (!notificacion) {
      throw new NotFoundException('Notificación no encontrada');
    }

    await this.prisma.notificacion.update({
      where: { id: idNotificacion },
      data: { leida: true },
    });

    return {
      ok: true,
      mensaje: 'Notificación marcada como leída',
    };
  }
}