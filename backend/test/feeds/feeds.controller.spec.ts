import { Test, TestingModule } from '@nestjs/testing';
import { FeedsController } from 'src/feeds/feeds.controller';
import { FeedsService } from 'src/feeds/feeds.service';
import { FeedResponseDto } from 'src/feeds/dto/feed-response.dto';

describe('FeedsController', () => {
  let controller: FeedsController;
  let service: FeedsService;

  const mockFeedResponse: FeedResponseDto = {
    subscriptionId: '123e4567-e89b-12d3-a456-426614174001',
    updatedAt: '2024-01-01',
    articlesCount: 5,
  };

  const mockFeedsService = {
    update: jest.fn(),
    cleanupArticles: jest.fn(),
    updateAll: jest.fn(),
    cleanupAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedsController],
      providers: [
        {
          provide: FeedsService,
          useValue: mockFeedsService,
        },
      ],
    }).compile();

    controller = module.get<FeedsController>(FeedsController);
    service = module.get<FeedsService>(FeedsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateFeedForSub', () => {
    it('should update feed for a specific subscription', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174001';
      mockFeedsService.update.mockResolvedValue(mockFeedResponse);

      const result = await controller.updateFeedForSub(subscriptionId);

      expect(service.update).toHaveBeenCalledWith(subscriptionId);
      expect(result).toEqual(mockFeedResponse);
    });
  });

  describe('cleanupFeedForSub', () => {
    it('should cleanup articles for a specific subscription', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174001';
      const cleanupResponse = { ...mockFeedResponse, articlesCount: 10 };
      mockFeedsService.cleanupArticles.mockResolvedValue(cleanupResponse);

      const result = await controller.cleanupFeedForSub(subscriptionId);

      expect(service.cleanupArticles).toHaveBeenCalledWith(subscriptionId);
      expect(result).toEqual(cleanupResponse);
    });
  });

  describe('updateFeedForAll', () => {
    it('should update feeds for all subscriptions', async () => {
      const allUpdateResponse = {
        subscriptionId: null,
        updatedAt: '2024-01-01',
        articlesCount: 25,
      };
      mockFeedsService.updateAll.mockResolvedValue(allUpdateResponse);

      const result = await controller.updateFeedForAll();

      expect(service.updateAll).toHaveBeenCalled();
      expect(result).toEqual(allUpdateResponse);
    });
  });

  describe('cleanupFeedForAll', () => {
    it('should cleanup articles for all subscriptions', async () => {
      const allCleanupResponse = {
        subscriptionId: null,
        updatedAt: '2024-01-01',
        articlesCount: 50,
      };
      mockFeedsService.cleanupAll.mockResolvedValue(allCleanupResponse);

      const result = await controller.cleanupFeedForAll();

      expect(service.cleanupAll).toHaveBeenCalled();
      expect(result).toEqual(allCleanupResponse);
    });
  });
});
