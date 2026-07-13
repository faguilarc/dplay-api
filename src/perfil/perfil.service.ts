import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PerfilService {
  constructor(private prisma: PrismaService) {}

  async verDatosUsuario(idUsuario: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
      select: {
        id: true,
        usuario: true,
        nombre: true,
        email: true,
        saldo: true,
        coins: true,
        rol: true,
        activo: true,
        fechaCreacion: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      ok: true,
      data: usuario,
    };
  }

  async getMontoDisponibleUsuario(idUsuario: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
      select: { saldo: true, coins: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      ok: true,
      data: {
        saldo: usuario.saldo,
        coins: usuario.coins,
      },
    };
  }
}