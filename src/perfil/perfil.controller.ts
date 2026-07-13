import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PerfilService } from './perfil.service.js';
import { VerDatosUsuarioDto } from './dto/ver-datos-usuario.dto.js';
import { CurrentUser } from '../common/decorators/usuario.decorator.js';

@ApiTags('Perfil')
@ApiBearerAuth()
@Controller('dplay')
@UseGuards(JwtAuthGuard)
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Post('verDatosUsuario')
  @ApiOperation({ summary: 'Ver datos del usuario' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async verDatosUsuario(@Body() dto: VerDatosUsuarioDto) {
    return this.perfilService.verDatosUsuario(dto.idUsuario);
  }

  @Post('getMontoDisponibleUsuario')
  @ApiOperation({ summary: 'Obtener monto disponible del usuario' })
  async getMontoDisponible(@CurrentUser() user: any) {
    return this.perfilService.getMontoDisponibleUsuario(user.id);
  }
}