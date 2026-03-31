import { Controller, Get } from '@nestjs/common';
import { AppService, HealthCheckResponse } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  getHealth(): HealthCheckResponse {
    return this.appService.healthCheck();
  }
}
