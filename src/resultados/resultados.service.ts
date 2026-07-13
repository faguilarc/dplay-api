import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ResultadosService {
  constructor(private prisma: PrismaService) {}

  async getJugadaDiaria(fecha: string) {
    const start = new Date(fecha);
    const end = new Date(fecha);
    end.setDate(end.getDate() + 1);

    const jugadas = await this.prisma.jugadaDiaria.findMany({
      where: {
        fecha: {
          gte: start,
          lt: end,
        },
      },
      orderBy: [{ sorteo: 'asc' }, { tipo: 'asc' }],
    });

    return {
      ok: true,
      data: jugadas,
    };
  }

  async buscarJugadaPremiada(fecha: string, idUsuario: number) {
    const start = new Date(fecha);
    const end = new Date(fecha);
    end.setDate(end.getDate() + 1);

    const jugadasDiarias = await this.prisma.jugadaDiaria.findMany({
      where: {
        fecha: {
          gte: start,
          lt: end,
        },
      },
    });

    const jugadasUsuario = await this.prisma.jugada.findMany({
      where: {
        usuarioId: idUsuario,
        fecha: {
          gte: start,
          lt: end,
        },
        estado: 'activa',
      },
      include: { ticket: true, mes: true },
    });

    const premiadas: any[] = [];

    for (const jugada of jugadasUsuario) {
      for (const diaria of jugadasDiarias) {
        if (diaria.tipo === jugada.tipo) {
          const numeroJugada = jugada.numero.padStart(
            diaria.tipo === 'grande' ? 4 : 2,
            '0',
          );
          const numeroGanador = diaria.numero.padStart(
            diaria.tipo === 'grande' ? 4 : 2,
            '0',
          );

          if (numeroJugada === numeroGanador) {
            premiadas.push({
              jugada,
              resultado: diaria,
              montoPremio: jugada.monto * (diaria.tipo === 'grande' ? 80 : 10),
            });
          }
        }
      }
    }

    if (premiadas.length > 0) {
      const ids = premiadas.map((p) => p.jugada.id);
      await this.prisma.jugada.updateMany({
        where: { id: { in: ids } },
        data: { estado: 'premiada' },
      });
    }

    return {
      ok: true,
      data: premiadas,
    };
  }
}