import { Injectable } from '@nestjs/common';

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
}

@Injectable()
export class AppService {
  healthCheck(): HealthCheckResponse {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
