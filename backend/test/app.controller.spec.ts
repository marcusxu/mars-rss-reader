import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const mockAppService = {
      healthCheck: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('health check', () => {
    it('should return health status', async () => {
      const healthResponse = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: 'test',
        version: '1.0.0',
      };

      jest.spyOn(appService, 'healthCheck').mockReturnValue(healthResponse);

      const result = appController.getHealth();
      expect(result).toEqual(healthResponse);
      expect(appService.healthCheck).toHaveBeenCalled();
    });
  });
});
