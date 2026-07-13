import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { NotificacionesService } from './notificaciones.service.js';
import { ListarNotificacionDto, NotificacionLeidaDto } from './dto/notificacion.dto.js';

@ApiTags('Notificaciones')
@ApiBearerAuth()
@Controller('dplay')
@UseGuards(JwtAuthGuard)
export class NotificacionesController {
  constructor(
    private readonly notificacionesService: NotificacionesService,
  ) {}

  @Post('listarNotificacion')
  @ApiOperation({ summary: 'Listar notificaciones de un usuario' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async listarNotificacion(@Body() dto: ListarNotificacionDto) {
    return this.notificacionesService.listarNotificacion(dto.idUsuario);
  }

  @Post('notificacionLeida')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async notificacionLeida(@Body() dto: NotificacionLeidaDto) {
    return this.notificacionesService.notificacionLeida(dto.idNotificacion);
  }
}