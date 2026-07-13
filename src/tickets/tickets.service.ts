import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async getTicket(idJugada: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { jugadaId: idJugada },
      include: {
        jugada: {
          include: { usuario: true, mes: true },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return {
      ok: true,
      data: ticket,
    };
  }

  async listarTickets(idUsuario: number, estado?: string) {
    const where: any = { jugada: { usuarioId: idUsuario } };
    if (estado) {
      where.estado = estado;
    }

    const tickets = await this.prisma.ticket.findMany({
      where,
      include: {
        jugada: {
          include: { mes: true },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    return {
      ok: true,
      data: tickets,
    };
  }
}