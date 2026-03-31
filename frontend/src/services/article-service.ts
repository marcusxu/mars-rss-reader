import { apiClient } from './api-client';
import { handleApiError } from './error-handler';
import {
  Article,
  ArticleFilter,
  PaginationResponse,
  UpdateArticleRequest,
  BatchUpdateArticleRequest,
  BatchUpdateResponse,
  ServiceResult,
} from '../types';

export const articleService = {
  async getArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
    const params = new URLSearchParams();
    
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.perPage) params.append('perPage', String(filter.perPage));
    if (filter?.id) params.append('id', filter.id);
    if (filter?.title) params.append('title', filter.title);
    if (filter?.content) params.append('content', filter.content);
    if (filter?.link) params.append('link', filter.link);
    if (filter?.author) params.append('author', filter.author);
    if (filter?.subscriptionId) params.append('subscriptionId', filter.subscriptionId);
    if (filter?.isRead !== undefined) params.append('isRead', String(filter.isRead));
    if (filter?.isFavorite !== undefined) params.append('isFavorite', String(filter.isFavorite));

    const response = await apiClient.get<PaginationResponse<Article>>(
      `/articles?${params.toString()}`
    );
    return response.data;
  },

  async searchArticles(filter?: ArticleFilter): Promise<PaginationResponse<Article>> {
    const params = new URLSearchParams();
    
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.perPage) params.append('perPage', String(filter.perPage));
    if (filter?.title) params.append('title', filter.title);
    if (filter?.content) params.append('content', filter.content);
    if (filter?.author) params.append('author', filter.author);

    const response = await apiClient.get<PaginationResponse<Article>>(
      `/articles/search?${params.toString()}`
    );
    return response.data;
  },

  async getArticleById(id: string): Promise<Article> {
    const response = await apiClient.get<Article>(`/articles/${id}`);
    return response.data;
  },

  async updateArticle(id: string, data: UpdateArticleRequest): Promise<Article> {
    const response = await apiClient.patch<Article>(`/articles/${id}`, data);
    return response.data;
  },

  async batchUpdateArticles(data: BatchUpdateArticleRequest): Promise<BatchUpdateResponse> {
    const response = await apiClient.patch<BatchUpdateResponse>(
      '/articles/batch-update',
      data
    );
    return response.data;
  },

  async toggleReadStatus(article: Article): Promise<ServiceResult<Article>> {
    try {
      const updated = await this.updateArticle(article.id, {
        isRead: !article.isRead,
      });
      return { success: true, data: updated };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async toggleFavoriteStatus(article: Article): Promise<ServiceResult<Article>> {
    try {
      const updated = await this.updateArticle(article.id, {
        isFavorite: !article.isFavorite,
      });
      return { success: true, data: updated };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async markAllAsRead(articleIds: string[]): Promise<ServiceResult<BatchUpdateResponse>> {
    try {
      const result = await this.batchUpdateArticles({
        ids: articleIds,
        isRead: true,
      });
      return { success: true, data: result };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
