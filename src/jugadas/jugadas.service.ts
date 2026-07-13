import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { InsertarJugadaDto } from './dto/insertar-jugada.dto.js';
import { MontoDisponibleDto } from './dto/monto-disponible.dto.js';

@Injectable()
export class JugadasService {
  constructor(private prisma: PrismaService) {}

  async insertarJugada(dto: InsertarJugadaDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: dto.idUsuario },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.activo) {
      throw new BadRequestException('Usuario inactivo');
    }

    const mes = await this.prisma.mes.findUnique({
      where: { id: dto.idMes },
    });

    if (!mes) {
      throw new NotFoundException('Mes no encontrado');
    }

    if (dto.monto > user.saldo) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const montoDisponible = mes.limiteCoins - mes.limiteConsumido;
    if (dto.monto > montoDisponible) {
      throw new BadRequestException('Límite de coins del mes alcanzado');
    }

    const jugada = await this.prisma.jugada.create({
      data: {
        usuarioId: dto.idUsuario,
        numero: dto.numero,
        monto: dto.monto,
        tipo: dto.tipo,
        numeroFijo: dto.numeroFijo,
        combinacion: dto.combinacion,
        mesId: dto.idMes,
      },
    });

    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
    const numeroTicket = `T-${dateStr}-${randomDigits}`;

    const ticket = await this.prisma.ticket.create({
      data: {
        jugadaId: jugada.id,
        numeroTicket,
        monto: dto.monto,
      },
    });

    await this.prisma.usuario.update({
      where: { id: dto.idUsuario },
      data: { saldo: { decrement: dto.monto } },
    });

    await this.prisma.mes.update({
      where: { id: dto.idMes },
      data: { limiteConsumido: { increment: dto.monto } },
    });

    return {
      ok: true,
      data: {
        idJugada: jugada.id,
        idTicket: ticket.id,
        numeroTicket: ticket.numeroTicket,
        mensaje: 'Jugada registrada exitosamente',
      },
    };
  }

  async getMontoDisponible(dto: MontoDisponibleDto) {
    const mes = await this.prisma.mes.findUnique({
      where: { id: dto.idMes },
    });

    if (!mes) {
      throw new NotFoundException('Mes no encontrado');
    }

    const disponible = mes.limiteCoins - mes.limiteConsumido;

    let montoPorNumero = disponible;
    if (dto.numeros.length > 0) {
      montoPorNumero = disponible / dto.numeros.length;
    }

    return {
      ok: true,
      data: {
        montoDisponible: Math.floor(montoPorNumero * 100) / 100,
        limiteCoins: mes.limiteCoins,
        limiteConsumido: mes.limiteConsumido,
      },
    };
  }

  async getTicket(idJugada: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { jugadaId: idJugada },
      include: { jugada: { include: { usuario: true, mes: true } } },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return {
      ok: true,
      data: ticket,
    };
  }

  async finalSales(fechaInicio: string, fechaFin: string, idUsuario: number) {
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    const tickets = await this.prisma.ticket.findMany({
      where: {
        jugada: {
          usuarioId: idUsuario,
          fecha: { gte: start, lte: end },
        },
      },
      include: {
        jugada: {
          include: { usuario: true, mes: true },
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