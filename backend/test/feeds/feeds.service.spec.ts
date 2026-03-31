import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { FeedsService } from 'src/feeds/feeds.service';
import { Article } from 'src/articles/entities/article.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FeedsService', () => {
  let service: FeedsService;
  let articleRepository: Repository<Article>;
  let subscriptionRepository: Repository<Subscription>;

  const mockSubscription: Subscription = {
    id: 'sub1',
    url: 'https://example.com/rss.xml',
    name: 'Test Feed',
    category: 'Tech',
    description: 'Test RSS Feed',
    createdAt: new Date(),
    updatedAt: new Date(),
    articles: [],
  };

  const mockArticle: Article = {
    id: '1',
    title: 'Test Article',
    content: 'Test Content',
    link: 'https://example.com/article1',
    author: 'Test Author',
    pubDate: new Date('2024-01-01'),
    isRead: false,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    subscription: mockSubscription,
  };

  const mockRssResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Test Feed</title>
        <description>Test RSS Feed</description>
        <item>
          <title>Test Article</title>
          <link>https://example.com/article1</link>
          <description>Test Content</description>
          <author>Test Author</author>
          <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
        </item>
      </channel>
    </rss>`;

  const mockArticleRepository = {
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockSubscriptionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedsService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository,
        },
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    service = module.get<FeedsService>(FeedsService);
    articleRepository = module.get<Repository<Article>>(
      getRepositoryToken(Article),
    );
    subscriptionRepository = module.get<Repository<Subscription>>(
      getRepositoryToken(Subscription),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should update feed for a subscription successfully', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      mockedAxios.get.mockResolvedValue({ data: mockRssResponse });
      mockArticleRepository.find.mockResolvedValue([]);
      mockArticleRepository.save.mockResolvedValue([mockArticle]);

      const result = await service.update('sub1');

      expect(mockSubscriptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'sub1' },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        mockSubscription.url,
        expect.objectContaining({
          timeout: 30000,
          headers: expect.objectContaining({
            'User-Agent': 'Mars RSS Reader/1.0 (RSS Feed Parser)',
          }),
        }),
      );
      expect(result.subscriptionId).toBe('sub1');
      expect(result.articlesCount).toBe(1);
    });

    it('should throw NotFoundException when subscription not found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockSubscriptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
      });
    });

    it('should handle empty RSS feed', async () => {
      const emptyRssResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Empty Feed</title>
          </channel>
        </rss>`;

      mockSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      mockedAxios.get.mockResolvedValue({ data: emptyRssResponse });

      const result = await service.update('sub1');

      expect(result.articlesCount).toBe(0);
    });

    it('should handle network errors gracefully', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(service.update('sub1')).rejects.toThrow();
    });
  });

  describe('updateAll', () => {
    it('should update all subscriptions', async () => {
      const subscriptions = [mockSubscription];
      mockSubscriptionRepository.find.mockResolvedValue(subscriptions);

      // Mock the update method to avoid actual RSS fetching
      jest.spyOn(service, 'update').mockResolvedValue({
        subscriptionId: 'sub1',
        updatedAt: '2024-01-01',
        articlesCount: 5,
      });

      const result = await service.updateAll();

      expect(mockSubscriptionRepository.find).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalledWith('sub1');
      expect(result.articlesCount).toBe(5);
    });

    it('should handle empty subscription list', async () => {
      mockSubscriptionRepository.find.mockResolvedValue([]);

      const result = await service.updateAll();

      expect(result.articlesCount).toBe(0);
    });

    it('should handle partial failures in batch update', async () => {
      const subscriptions = [
        mockSubscription,
        { ...mockSubscription, id: 'sub2' },
      ];
      mockSubscriptionRepository.find.mockResolvedValue(subscriptions);

      jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({
          subscriptionId: 'sub1',
          updatedAt: '2024-01-01',
          articlesCount: 5,
        })
        .mockRejectedValueOnce(new Error('Update failed'));

      const result = await service.updateAll();

      expect(result.articlesCount).toBe(5); // Only successful update counted
    });
  });

  describe('cleanupArticles', () => {
    it('should cleanup articles for a subscription', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);
      mockArticleRepository.delete.mockResolvedValue({ affected: 10 });

      const result = await service.cleanupArticles('sub1');

      expect(mockSubscriptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'sub1' },
      });
      expect(mockArticleRepository.delete).toHaveBeenCalledWith({
        subscription: { id: 'sub1' },
      });
      expect(result.articlesCount).toBe(10);
    });

    it('should throw NotFoundException when subscription not found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.cleanupArticles('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cleanupAll', () => {
    it('should cleanup articles for all subscriptions', async () => {
      const subscriptions = [mockSubscription];
      mockSubscriptionRepository.find.mockResolvedValue(subscriptions);

      jest.spyOn(service, 'cleanupArticles').mockResolvedValue({
        subscriptionId: 'sub1',
        updatedAt: '2024-01-01',
        articlesCount: 10,
      });

      const result = await service.cleanupAll();

      expect(service.cleanupArticles).toHaveBeenCalledWith('sub1');
      expect(result.articlesCount).toBe(10);
    });

    it('should handle empty subscription list', async () => {
      mockSubscriptionRepository.find.mockResolvedValue([]);

      const result = await service.cleanupAll();

      expect(result.articlesCount).toBe(0);
    });
  });
});
