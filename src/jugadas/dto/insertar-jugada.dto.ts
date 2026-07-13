import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class InsertarJugadaDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsOptional()
  numeroFijo?: string;

  @IsString()
  @IsOptional()
  combinacion?: string;

  @IsNumber()
  @IsNotEmpty()
  idMes: number;
}