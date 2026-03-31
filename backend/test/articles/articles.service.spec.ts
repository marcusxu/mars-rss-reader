import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ArticlesService } from 'src/articles/articles.service';
import { Article } from 'src/articles/entities/article.entity';
import { UpdateArticleDto } from 'src/articles/dto/update-article.dto';
import { FindArticleDto } from 'src/articles/dto/find-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;

  const mockArticle: Article = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Article',
    content: 'Test Content',
    link: 'https://example.com/test',
    author: 'Test Author',
    pubDate: new Date('2024-01-01'),
    isRead: false,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    subscription: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      url: 'https://example.com/rss',
      name: 'Test Feed',
      category: 'Tech',
      description: 'Test Feed',
      createdAt: new Date(),
      updatedAt: new Date(),
      articles: [],
    },
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      findOne: jest.fn(),
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockQueryRunner.connect.mockClear();
    mockQueryRunner.startTransaction.mockClear();
    mockQueryRunner.commitTransaction.mockClear();
    mockQueryRunner.rollbackTransaction.mockClear();
    mockQueryRunner.release.mockClear();
    mockQueryRunner.manager.findOne.mockClear();
    mockQueryRunner.manager.save.mockClear();
    mockQueryBuilder.leftJoinAndSelect.mockClear();
    mockQueryBuilder.andWhere.mockClear();
    mockQueryBuilder.orderBy.mockClear();
    mockQueryBuilder.skip.mockClear();
    mockQueryBuilder.take.mockClear();
    mockQueryBuilder.getManyAndCount.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should update an article successfully', async () => {
      const articleId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateArticleDto = { isRead: true };
      const updatedArticle = { ...mockArticle, isRead: true };

      mockRepository.findOne.mockResolvedValue(mockArticle);
      mockRepository.save.mockResolvedValue(updatedArticle);

      const result = await service.update(articleId, updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: articleId },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockArticle,
        ...updateDto,
      });
      expect(result.articleId).toBe(articleId);
    });

    it('should throw NotFoundException when article not found', async () => {
      const articleId = '123e4567-e89b-12d3-a456-426614174999';
      const updateDto: UpdateArticleDto = { isRead: true };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(articleId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: articleId },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('getArticlesBySubId', () => {
    it('should return articles for a subscription', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174001';
      const articles = [mockArticle];

      mockRepository.find.mockResolvedValue(articles);

      const result = await service.getArticlesBySubId(subscriptionId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { subscription: { id: subscriptionId } },
        order: { pubDate: 'DESC' },
      });
      expect(result).toEqual(articles);
    });
  });

  describe('find', () => {
    it('should return paginated articles', async () => {
      const findDto: FindArticleDto = { page: 1, perPage: 10 };
      const articles = [mockArticle];
      const total = 1;

      mockQueryBuilder.getManyAndCount.mockResolvedValue([articles, total]);

      const result = await service.find(findDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('article');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'article.subscription',
        'subscription',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'article.createdAt',
        'DESC',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.data).toEqual(articles);
      expect(result.total).toBe(total);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });

    it('should apply filters correctly', async () => {
      const findDto: FindArticleDto = {
        title: 'test',
        author: 'author',
        isRead: true,
        subscriptionId: '123e4567-e89b-12d3-a456-426614174001',
        page: 1,
        perPage: 10,
      };
      const articles = [mockArticle];
      const total = 1;

      mockQueryBuilder.getManyAndCount.mockResolvedValue([articles, total]);

      await service.find(findDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'article.title ILIKE :title',
        { title: '%test%' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'article.author ILIKE :author',
        { author: '%author%' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'article.isRead = :isRead',
        { isRead: true },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'subscription.id = :subscriptionId',
        { subscriptionId: '123e4567-e89b-12d3-a456-426614174001' },
      );
    });

    it('should use default pagination values', async () => {
      const findDto: FindArticleDto = {};
      const articles = [mockArticle];
      const total = 1;

      mockQueryBuilder.getManyAndCount.mockResolvedValue([articles, total]);

      const result = await service.find(findDto);

      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });

  describe('batchUpdate', () => {
    it('should batch update articles successfully', async () => {
      const updateDto: UpdateArticleDto = {
        ids: [
          '123e4567-e89b-12d3-a456-426614174000',
          '123e4567-e89b-12d3-a456-426614174002',
          '123e4567-e89b-12d3-a456-426614174003',
        ],
        isRead: true,
      };

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockArticle)
        .mockResolvedValueOnce({ ...mockArticle, id: '123e4567-e89b-12d3-a456-426614174002' })
        .mockResolvedValueOnce({ ...mockArticle, id: '123e4567-e89b-12d3-a456-426614174003' });

      mockQueryRunner.manager.save.mockResolvedValue({});

      const result = await service.batchUpdate(updateDto);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result.updatedCount).toBe(3);
      expect(result.failedIds).toHaveLength(0);
      expect(result.message).toBe('Updated 3 articles, 0 failed');
    });

    it('should handle partial failures in batch update', async () => {
      const updateDto: UpdateArticleDto = {
        ids: [
          '123e4567-e89b-12d3-a456-426614174000',
          '123e4567-e89b-12d3-a456-426614174002',
          '123e4567-e89b-12d3-a456-426614174003',
        ],
        isRead: true,
      };

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockArticle)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...mockArticle, id: '123e4567-e89b-12d3-a456-426614174003' });

      mockQueryRunner.manager.save.mockResolvedValue({});

      const result = await service.batchUpdate(updateDto);

      expect(result.updatedCount).toBe(2);
      expect(result.failedIds).toEqual(['123e4567-e89b-12d3-a456-426614174002']);
      expect(result.message).toBe('Updated 2 articles, 1 failed');
    });

    it('should return empty result when no IDs provided', async () => {
      const updateDto: UpdateArticleDto = { isRead: true };

      const result = await service.batchUpdate(updateDto);

      expect(result.updatedCount).toBe(0);
      expect(result.failedIds).toHaveLength(0);
      expect(result.message).toBe('No article IDs provided');
      expect(mockQueryRunner.connect).not.toHaveBeenCalled();
    });

    it('should handle errors during batch update', async () => {
      const updateDto: UpdateArticleDto = {
        ids: [
          '123e4567-e89b-12d3-a456-426614174000',
          '123e4567-e89b-12d3-a456-426614174002',
        ],
        isRead: true,
      };

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockArticle)
        .mockResolvedValueOnce({ ...mockArticle, id: '123e4567-e89b-12d3-a456-426614174002' });

      mockQueryRunner.manager.save
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce(new Error('Database error'));

      const result = await service.batchUpdate(updateDto);

      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result.failedIds).toContain('123e4567-e89b-12d3-a456-426614174002');
    });

    it('should update both isRead and isFavorite', async () => {
      const updateDto: UpdateArticleDto = {
        ids: ['123e4567-e89b-12d3-a456-426614174000'],
        isRead: true,
        isFavorite: true,
      };

      mockQueryRunner.manager.findOne.mockResolvedValue(mockArticle);
      mockQueryRunner.manager.save.mockResolvedValue({});

      const result = await service.batchUpdate(updateDto);

      const savedArticle = mockQueryRunner.manager.save.mock.calls[0][0];
      expect(savedArticle.isRead).toBe(true);
      expect(savedArticle.isFavorite).toBe(true);
      expect(result.updatedCount).toBe(1);
    });
  });
});
