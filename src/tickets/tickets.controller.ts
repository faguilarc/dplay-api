import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { TicketsService } from './tickets.service.js';
import { GetTicketDto, ListTicketsDto } from './dto/ticket.dto.js';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('dplay')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('getTicketInfo')
  @ApiOperation({ summary: 'Obtener información de ticket' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getTicket(@Body() dto: GetTicketDto) {
    return this.ticketsService.getTicket(dto.idJugada);
  }

  @Post('listarTickets')
  @ApiOperation({ summary: 'Listar tickets de un usuario' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async listarTickets(@Body() dto: ListTicketsDto) {
    return this.ticketsService.listarTickets(dto.idUsuario, dto.estado);
  }
}