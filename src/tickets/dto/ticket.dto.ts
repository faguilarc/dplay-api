import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetTicketDto {
  @IsNumber()
  @IsNotEmpty()
  idJugada: number;
}

export class ListTicketsDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;

  @IsString()
  @IsOptional()
  estado?: string;
}