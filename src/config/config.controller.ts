import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from './config.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Configuración')
@ApiBearerAuth()
@Controller('dplay')
@UseGuards(JwtAuthGuard)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('getAnnoActivo')
  @ApiOperation({ summary: 'Obtener año activo' })
  async getAnnoActivo() {
    return this.configService.getAnnoActivo();
  }

  @Get('getAnnos')
  @ApiOperation({ summary: 'Listar años' })
  async getAnnos() {
    return this.configService.getAnnos();
  }

  @Get('getNomMeses')
  @ApiOperation({ summary: 'Obtener nombres de meses' })
  async getNomMeses() {
    return this.configService.getNomMeses();
  }

  @Get('getRango')
  @ApiOperation({ summary: 'Obtener rangos de apuestas' })
  async getRango() {
    return this.configService.getRango();
  }

  @Get('getInfoHabilitarApp')
  @ApiOperation({ summary: 'Información de habilitación de la app' })
  async getInfoHabilitarApp() {
    return this.configService.getInfoHabilitarApp();
  }
}