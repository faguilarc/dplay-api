import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ParletService } from './parlet.service.js';
import { ParletDisponibleDto } from './dto/parlet.dto.js';

@ApiTags('Parlet')
@ApiBearerAuth()
@Controller('dplay')
@UseGuards(JwtAuthGuard)
export class ParletController {
  constructor(private readonly parletService: ParletService) {}

  @Post('getParletDisponible')
  @ApiOperation({ summary: 'Obtener combinaciones parlet disponibles' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getParletDisponible(@Body() dto: ParletDisponibleDto) {
    return this.parletService.getParletDisponible(
      dto.numeroFijo,
      dto.tipo,
      dto.idMes,
    );
  }
}