import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async getAnnoActivo() {
    const anno = await this.prisma.anno.findFirst({
      where: { activo: true },
      include: { meses: { where: { activo: true }, orderBy: { mes: 'asc' } } },
    });

    if (!anno) {
      return { ok: true, data: null };
    }

    return {
      ok: true,
      data: {
        id: anno.id,
        anno: anno.anno,
        activo: anno.activo,
        meses: anno.meses,
      },
    };
  }

  async getAnnos() {
    const annos = await this.prisma.anno.findMany({
      orderBy: { anno: 'desc' },
    });

    return { ok: true, data: annos };
  }

  async getNomMeses() {
    const meses = [
      { id: 1, nombre: 'Enero' },
      { id: 2, nombre: 'Febrero' },
      { id: 3, nombre: 'Marzo' },
      { id: 4, nombre: 'Abril' },
      { id: 5, nombre: 'Mayo' },
      { id: 6, nombre: 'Junio' },
      { id: 7, nombre: 'Julio' },
      { id: 8, nombre: 'Agosto' },
      { id: 9, nombre: 'Septiembre' },
      { id: 10, nombre: 'Octubre' },
      { id: 11, nombre: 'Noviembre' },
      { id: 12, nombre: 'Diciembre' },
    ];

    return { ok: true, data: meses };
  }

  async getRango() {
    const rangos = await this.prisma.rango.findMany();

    return { ok: true, data: rangos };
  }

  async getInfoHabilitarApp() {
    const configs = await this.prisma.configuracion.findMany({
      where: {
        clave: {
          in: ['habilitada', 'horaDia', 'horaNoche'],
        },
      },
    });

    const get = (clave: string, def: string) =>
      configs.find((c) => c.clave === clave)?.valor ?? def;

    return {
      ok: true,
      data: {
        habilitada: get('habilitada', 'true') === 'true',
        horaDia: get('horaDia', '08:00'),
        horaNoche: get('horaNoche', '20:00'),
      },
    };
  }
}