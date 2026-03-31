import { Test, TestingModule } from '@nestjs/testing';
import { REQUEST } from '@nestjs/core';
import { NotFoundException } from '@nestjs/common';
import { ArticlesController } from 'src/articles/articles.controller';
import { ArticlesService } from 'src/articles/articles.service';
import { FindArticleDto } from 'src/articles/dto/find-article.dto';
import { UpdateArticleDto } from 'src/articles/dto/update-article.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';
import { Article } from 'src/articles/entities/article.entity';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

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

  const mockPaginatedResult: PaginationResponseDto<Article> = {
    page: 1,
    perPage: 10,
    total: 1,
    totalPages: 1,
    data: [mockArticle],
  };

  const mockArticlesService = {
    find: jest.fn(),
    update: jest.fn(),
    batchUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchArticles', () => {
    it('should return paginated articles for search', async () => {
      const searchDto: FindArticleDto = { title: 'test', page: 1, perPage: 10 };
      mockArticlesService.find.mockResolvedValue(mockPaginatedResult);

      const result = await controller.searchArticles(searchDto);

      expect(service.find).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('getArticleById', () => {
    it('should return an article by ID', async () => {
      const articleId = '123e4567-e89b-12d3-a456-426614174000';
      mockArticlesService.find.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getArticleById(articleId);

      expect(service.find).toHaveBeenCalledWith({
        id: articleId,
        page: 1,
        perPage: 1,
      });
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when article not found', async () => {
      const articleId = '123e4567-e89b-12d3-a456-426614174999';
      const emptyResult = { ...mockPaginatedResult, data: [] };
      mockArticlesService.find.mockResolvedValue(emptyResult);

      await expect(controller.getArticleById(articleId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllArticles', () => {
    it('should return paginated articles', async () => {
      const findDto: FindArticleDto = { page: 1, perPage: 10 };
      mockArticlesService.find.mockResolvedValue(mockPaginatedResult);

      const result = await controller.getAllArticles(findDto);

      expect(service.find).toHaveBeenCalledWith(findDto);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('updateArticle', () => {
    it('should update an article', async () => {
      const articleId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateArticleDto = { isRead: true };
      const expectedResponse = { articleId, updatedAt: '2024-01-01' };
      mockArticlesService.update.mockResolvedValue(expectedResponse);

      const result = await controller.updateArticle(articleId, updateDto);

      expect(service.update).toHaveBeenCalledWith(articleId, updateDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('batchUpdateArticles', () => {
    it('should batch update articles successfully', async () => {
      const updateDto: UpdateArticleDto = {
        isRead: true,
        ids: ['123e4567-e89b-12d3-a456-426614174000', '2', '3'],
      };
      const expectedResponse = {
        updatedCount: 3,
        failedIds: [],
        message: 'Updated 3 articles, 0 failed',
      };
      mockArticlesService.batchUpdate.mockResolvedValue(expectedResponse);

      const result = await controller.batchUpdateArticles(updateDto);

      expect(service.batchUpdate).toHaveBeenCalledWith(updateDto);
      expect(result.updatedCount).toBe(3);
      expect(result.failedIds).toHaveLength(0);
      expect(result.message).toBe('Updated 3 articles, 0 failed');
    });

    it('should handle partial failures in batch update', async () => {
      const updateDto: UpdateArticleDto = {
        isRead: true,
        ids: ['123e4567-e89b-12d3-a456-426614174000', '2', '3'],
      };
      const expectedResponse = {
        updatedCount: 2,
        failedIds: ['2'],
        message: 'Updated 2 articles, 1 failed',
      };
      mockArticlesService.batchUpdate.mockResolvedValue(expectedResponse);

      const result = await controller.batchUpdateArticles(updateDto);

      expect(service.batchUpdate).toHaveBeenCalledWith(updateDto);
      expect(result.updatedCount).toBe(2);
      expect(result.failedIds).toEqual(['2']);
      expect(result.message).toBe('Updated 2 articles, 1 failed');
    });

    it('should return empty result when no IDs provided', async () => {
      const updateDto: UpdateArticleDto = { isRead: true };
      const expectedResponse = {
        updatedCount: 0,
        failedIds: [],
        message: 'No article IDs provided',
      };
      mockArticlesService.batchUpdate.mockResolvedValue(expectedResponse);

      const result = await controller.batchUpdateArticles(updateDto);

      expect(service.batchUpdate).toHaveBeenCalledWith(updateDto);
      expect(result.updatedCount).toBe(0);
      expect(result.failedIds).toHaveLength(0);
      expect(result.message).toBe('No article IDs provided');
    });
  });
});
