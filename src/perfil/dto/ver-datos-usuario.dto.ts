import { IsNumber, IsNotEmpty } from 'class-validator';

export class VerDatosUsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;
}