import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class JugadaDiariaDto {
  @IsString()
  @IsNotEmpty()
  fecha: string;
}

export class BuscarJugadaPremiadaDto {
  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;
}