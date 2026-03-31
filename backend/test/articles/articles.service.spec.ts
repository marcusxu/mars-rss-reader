import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ArticlesService } from 'src/articles/articles.service';
import { Article } from 'src/articles/entities/article.entity';
import { UpdateArticleDto } from 'src/articles/dto/update-article.dto';
import { FindArticleDto } from 'src/articles/dto/find-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;

  const mockArticle: Article = {
    id: '1',
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
      id: 'sub1',
      url: 'https://example.com/rss',
      name: 'Test Feed',
      category: 'Tech',
      description: 'Test Feed',
      createdAt: new Date(),
      updatedAt: new Date(),
      articles: [],
    },
  };

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should update an article successfully', async () => {
      const articleId = '1';
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
      const articleId = 'non-existent';
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
      const subscriptionId = 'sub1';
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

      mockRepository.findAndCount.mockResolvedValue([articles, total]);

      const result = await service.find(findDto);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['subscription'],
        where: {},
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
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
        subscriptionId: 'sub1',
        page: 1,
        perPage: 10,
      };
      const articles = [mockArticle];
      const total = 1;

      mockRepository.findAndCount.mockResolvedValue([articles, total]);

      await service.find(findDto);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['subscription'],
        where: {
          title: expect.any(Object), // ILike matcher
          author: expect.any(Object), // ILike matcher
          isRead: true,
          subscription: { id: 'sub1' },
        },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should use default pagination values', async () => {
      const findDto: FindArticleDto = {};
      const articles = [mockArticle];
      const total = 1;

      mockRepository.findAndCount.mockResolvedValue([articles, total]);

      const result = await service.find(findDto);

      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });
});
