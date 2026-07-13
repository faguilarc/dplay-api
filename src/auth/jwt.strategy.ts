import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dplay-secret-key-2024',
    });
  }

  async validate(payload: { sub: number; usuario: string; rol: string }) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.activo) {
      throw new UnauthorizedException('Usuario no válido');
    }

    return {
      id: user.id,
      usuario: user.usuario,
      rol: user.rol,
      nombre: user.nombre,
    };
  }
}