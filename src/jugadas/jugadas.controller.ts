import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { JugadasService } from './jugadas.service.js';
import { InsertarJugadaDto } from './dto/insertar-jugada.dto.js';
import { MontoDisponibleDto } from './dto/monto-disponible.dto.js';
import { TicketDto } from './dto/ticket.dto.js';

@ApiTags('Jugadas')
@ApiBearerAuth()
@Controller('dplay')
@UseGuards(JwtAuthGuard)
export class JugadasController {
  constructor(private readonly jugadasService: JugadasService) {}

  @Post('insertarJugada')
  @ApiOperation({ summary: 'Insertar una nueva jugada' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async insertarJugada(@Body() dto: InsertarJugadaDto) {
    return this.jugadasService.insertarJugada(dto);
  }

  @Post('getMontoDisponible')
  @ApiOperation({ summary: 'Obtener monto disponible para apuesta' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getMontoDisponible(@Body() dto: MontoDisponibleDto) {
    return this.jugadasService.getMontoDisponible(dto);
  }

  @Post('getTicket')
  @ApiOperation({ summary: 'Obtener ticket por jugada' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getTicket(@Body() dto: TicketDto) {
    return this.jugadasService.getTicket(dto.idJugada);
  }

  @Post('finalSales')
  @ApiOperation({ summary: 'Ventas finales en rango de fechas' })
  async finalSales(
    @Body() body: { fechaInicio: string; fechaFin: string; idUsuario: number },
  ) {
    return this.jugadasService.finalSales(
      body.fechaInicio,
      body.fechaFin,
      body.idUsuario,
    );
  }
}