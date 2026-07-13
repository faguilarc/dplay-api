import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ParletService {
  constructor(private prisma: PrismaService) {}

  async getParletDisponible(numeroFijo: string, tipo: string, idMes: number) {
    const mes = await this.prisma.mes.findUnique({
      where: { id: idMes },
    });

    if (!mes) {
      throw new NotFoundException('Mes no encontrado');
    }

    const disponibles: string[] = [];
    const maxNum = tipo === 'grande' ? 10000 : 100;

    const numerosDeshabilitados = await this.prisma.numeroDeshabilitado.findMany({
      where: {
        tipo,
        mesId: idMes,
        activo: true,
      },
    });

    const deshabilitadosSet = new Set(
      numerosDeshabilitados.map((n) => n.numero.padStart(tipo === 'grande' ? 4 : 2, '0')),
    );

    for (let i = 0; i < maxNum; i++) {
      const num = i.toString().padStart(tipo === 'grande' ? 4 : 2, '0');
      if (!deshabilitadosSet.has(num)) {
        disponibles.push(num);
      }
    }

    const montoDisponible = mes.limiteCoins - mes.limiteConsumido;

    return {
      ok: true,
      data: {
        numeroFijo,
        tipo,
        combinaciones: disponibles,
        totalDisponibles: disponibles.length,
        montoDisponible,
      },
    };
  }
}