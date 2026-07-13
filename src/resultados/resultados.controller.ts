import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ResultadosService } from './resultados.service.js';
import { JugadaDiariaDto, BuscarJugadaPremiadaDto } from './dto/jugada-diaria.dto.js';

@ApiTags('Resultados')
@ApiBearerAuth()
@Controller('dplay')
@UseGuards(JwtAuthGuard)
export class ResultadosController {
  constructor(private readonly resultadosService: ResultadosService) {}

  @Post('getJugadaDiaria')
  @ApiOperation({ summary: 'Obtener jugada diaria por fecha' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getJugadaDiaria(@Body() dto: JugadaDiariaDto) {
    return this.resultadosService.getJugadaDiaria(dto.fecha);
  }

  @Post('buscarJugadaPremiada')
  @ApiOperation({ summary: 'Buscar jugadas premiadas para un usuario' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async buscarJugadaPremiada(@Body() dto: BuscarJugadaPremiadaDto) {
    return this.resultadosService.buscarJugadaPremiada(dto.fecha, dto.idUsuario);
  }
}