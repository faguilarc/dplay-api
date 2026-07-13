import { IsArray, IsNumber, IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class MontoDisponibleDto {
  @IsArray()
  @IsNotEmpty()
  numeros: string[];

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsNumber()
  @IsNotEmpty()
  idMes: number;
}