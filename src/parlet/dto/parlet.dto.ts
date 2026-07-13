import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ParletDisponibleDto {
  @IsString()
  @IsNotEmpty()
  numeroFijo: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsNumber()
  @IsNotEmpty()
  idMes: number;
}