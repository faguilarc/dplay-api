import { IsNumber, IsNotEmpty } from 'class-validator';

export class ListarNotificacionDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;
}

export class NotificacionLeidaDto {
  @IsNumber()
  @IsNotEmpty()
  idNotificacion: number;
}