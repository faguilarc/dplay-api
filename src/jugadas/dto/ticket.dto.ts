import { IsNumber, IsNotEmpty } from 'class-validator';

export class TicketDto {
  @IsNumber()
  @IsNotEmpty()
  idJugada: number;
}