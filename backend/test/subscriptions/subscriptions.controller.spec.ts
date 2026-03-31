// references: https://docs.nestjs.com/fundamentals/testing
// TODO: Add more tests for SubscriptionsController

import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from 'src/subscriptions/subscriptions.controller';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

describe('SubscriptionsController', () => {
  let subscriptionsController: SubscriptionsController;
  let subscriptionsService: SubscriptionsService;

  const mockSubscriptionsService = {
    create: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    subscriptionsController = module.get<SubscriptionsController>(
      SubscriptionsController,
    );
    subscriptionsService =
      module.get<SubscriptionsService>(SubscriptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(subscriptionsController).toBeDefined();
  });

  describe('createSubscription', () => {
    it('should create a subscription', async () => {
      const createDto = {
        url: 'https://example.com/rss',
        name: 'Test Feed',
        description: 'Test Description',
        category: 'Tech',
      };
      const expectedResult = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createDto,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      mockSubscriptionsService.create.mockResolvedValue(expectedResult);

      const result =
        await subscriptionsController.createSubscription(createDto);

      expect(subscriptionsService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteSubscription', () => {
    it('should delete a subscription', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = {
        id: subscriptionId,
        message: 'Subscription 1 deleted successfully.',
      };

      mockSubscriptionsService.remove.mockResolvedValue(expectedResult);

      const result =
        await subscriptionsController.deleteSubscription(subscriptionId);

      expect(subscriptionsService.remove).toHaveBeenCalledWith(subscriptionId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateSubscription', () => {
    it('should update a subscription', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto = { name: 'Updated Feed' };
      const expectedResult = {
        id: subscriptionId,
        name: 'Updated Feed',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      mockSubscriptionsService.update.mockResolvedValue(expectedResult);

      const result = await subscriptionsController.updateSubscription(
        subscriptionId,
        updateDto,
      );

      expect(subscriptionsService.update).toHaveBeenCalledWith(
        subscriptionId,
        updateDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllSubscriptions', () => {
    it('should get all subscriptions', async () => {
      const findDto = { page: 1, perPage: 10 };
      const expectedResult = {
        page: 1,
        perPage: 10,
        total: 1,
        totalPages: 1,
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            url: 'https://example.com/rss',
            name: 'Test Feed',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
      };

      mockSubscriptionsService.find.mockResolvedValue(expectedResult);

      const result = await subscriptionsController.getAllSubscriptions(findDto);

      expect(subscriptionsService.find).toHaveBeenCalledWith(findDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
