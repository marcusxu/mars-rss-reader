import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { CreateSubscriptionDto } from 'src/subscriptions/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from 'src/subscriptions/dto/update-subscription.dto';
import { FindSubscriptionDto } from 'src/subscriptions/dto/find-subscription.dto';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a subscription successfully', async () => {
      const createDto: CreateSubscriptionDto = {
        url: 'https://example.com/rss',
        name: 'Test Feed',
        description: 'Test Description',
        category: 'Tech',
      };

      const subscription = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(subscription);
      mockRepository.save.mockResolvedValue(subscription);

      const result = await service.create(createDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { url: createDto.url },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(subscription);
      expect(result).toEqual(
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          url: 'https://example.com/rss',
          name: 'Test Feed',
          description: 'Test Description',
          category: 'Tech',
        }),
      );
    });

    it('should throw BadRequestException if subscription already exists', async () => {
      const createDto: CreateSubscriptionDto = {
        url: 'https://example.com/rss',
        name: 'Test Feed',
      };

      const existingSubscription = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(existingSubscription);

      await expect(service.create(createDto)).rejects.toThrow(
        'Subscription with URL already exists:',
      );
    });
  });

  describe('remove', () => {
    it('should remove a subscription successfully', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const subscription = {
        id: subscriptionId,
        url: 'https://example.com/rss',
        name: 'Test Feed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(subscription);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(subscriptionId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: subscriptionId },
      });
      expect(mockRepository.delete).toHaveBeenCalledWith(subscriptionId);
      expect(result).toEqual({
        id: subscriptionId,
        message: `Subscription ${subscriptionId} deleted successfully.`,
      });
    });

    it('should throw NotFoundException if subscription not found', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174999';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(subscriptionId)).rejects.toThrow(
        'Subscription not found:',
      );
    });
  });

  describe('update', () => {
    it('should update a subscription successfully', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateSubscriptionDto = {
        name: 'Updated Feed',
        description: 'Updated Description',
      };

      const existingSubscription = {
        id: subscriptionId,
        url: 'https://example.com/rss',
        name: 'Test Feed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedSubscription = {
        ...existingSubscription,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValueOnce(existingSubscription);
      mockRepository.save.mockResolvedValue(updatedSubscription);

      const result = await service.update(subscriptionId, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: subscriptionId },
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Updated Feed',
          description: 'Updated Description',
        }),
      );
    });

    it('should throw NotFoundException if subscription not found', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174999';
      const updateDto: UpdateSubscriptionDto = {
        name: 'Updated Feed',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(subscriptionId, updateDto)).rejects.toThrow(
        'Subscription not found:',
      );
    });
  });

  describe('find', () => {
    it('should return paginated subscriptions', async () => {
      const findDto: FindSubscriptionDto = {
        page: 1,
        perPage: 10,
        category: 'Tech',
        name: 'Test',
      };

      const subscriptions = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          url: 'https://example1.com/rss',
          name: 'Test Feed 1',
          category: 'Tech',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          url: 'https://example2.com/rss',
          name: 'Test Feed 2',
          category: 'Tech',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([subscriptions, 2]);

      const result = await service.find(findDto);

      expect(mockRepository.findAndCount).toHaveBeenCalled();

      expect(result).toEqual({
        page: 1,
        perPage: 10,
        total: 2,
        totalPages: 1,
        data: subscriptions,
      });
    });
  });
});
