import { Test, TestingModule } from '@nestjs/testing';
import { AppService, HealthCheckResponse } from 'src/app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return health check response', () => {
      const result: HealthCheckResponse = service.healthCheck();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('environment');

      expect(result.status).toBe('healthy');
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.uptime).toBe('number');
      expect(result.version).toBe('1.0.0');
      expect(typeof result.environment).toBe('string');
    });

    it('should return current timestamp', () => {
      const beforeCall = Date.now();
      const result = service.healthCheck();
      const afterCall = Date.now();

      const resultTime = new Date(result.timestamp).getTime();

      expect(resultTime).toBeGreaterThanOrEqual(beforeCall);
      expect(resultTime).toBeLessThanOrEqual(afterCall);
    });

    it('should return process uptime', () => {
      const result = service.healthCheck();

      expect(result.uptime).toBeGreaterThan(0);
      expect(typeof result.uptime).toBe('number');
    });
  });
});
