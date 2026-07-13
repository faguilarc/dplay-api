import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { usuario: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(dto.password, user.clave);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = {
      sub: user.id,
      usuario: user.usuario,
      rol: user.rol,
    };

    return {
      ok: true,
      token: this.jwtService.sign(payload),
      idUsuario: user.id,
      nombre: user.nombre,
      usuario: user.usuario,
      rol: user.rol,
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ usuario: dto.usuario }, { email: dto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('El nombre de usuario o email ya existe');
    }

    const hashedPassword = await bcrypt.hash(dto.clave, 10);

    await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        usuario: dto.usuario,
        clave: hashedPassword,
      },
    });

    return {
      ok: true,
      mensaje: 'Usuario registrado',
    };
  }
}