import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository, DataSource } from 'typeorm';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { FindArticleDto } from './dto/find-article.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';
import { BatchUpdateResponseDto } from './dto/batch-update-response.dto';
import { ValidationUtil } from 'src/common/utils/validation.util';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private dataSource: DataSource,
  ) {}

  async update(
    articleId: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    this.logger.log(`Attempting to update article: ${articleId}`);
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      this.logger.warn(`Article not found: ${articleId}`);
      throw new NotFoundException(`Article not found: ${articleId}`);
    }
    Object.assign(article, updateArticleDto);
    const updatedArticle = await this.articleRepository.save(article);
    this.logger.log(`Successfully updated article: ${articleId}`);
    return this.mapToResponseDto(updatedArticle);
  }

  async getArticlesBySubId(subscriptionId: string): Promise<Article[]> {
    this.logger.log(`Attempting to get articles: ${subscriptionId}`);
    const articles = await this.articleRepository.find({
      where: { subscription: { id: subscriptionId } },
      order: { pubDate: 'DESC' },
    });
    return articles;
  }

  async find(
    findArticleDto: FindArticleDto,
  ): Promise<PaginationResponseDto<Article>> {
    if (findArticleDto.id) {
      ValidationUtil.validateUUID(findArticleDto.id, 'id');
    }
    if (findArticleDto.subscriptionId) {
      ValidationUtil.validateUUID(
        findArticleDto.subscriptionId,
        'subscriptionId',
      );
    }

    const page = findArticleDto?.page || 1;
    const perPage = findArticleDto?.perPage || 10;

    this.logger.log(
      `Attempting to find article: ${JSON.stringify(findArticleDto)}, page: ${page}, perPage: ${perPage}`,
    );

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.subscription', 'subscription');

    if (findArticleDto.author) {
      queryBuilder.andWhere('article.author ILIKE :author', {
        author: `%${findArticleDto.author}%`,
      });
    }
    if (findArticleDto.content) {
      queryBuilder.andWhere('article.content ILIKE :content', {
        content: `%${findArticleDto.content}%`,
      });
    }
    if (findArticleDto.isFavorite !== undefined) {
      queryBuilder.andWhere('article.isFavorite = :isFavorite', {
        isFavorite: findArticleDto.isFavorite,
      });
    }
    if (findArticleDto.isRead !== undefined) {
      queryBuilder.andWhere('article.isRead = :isRead', {
        isRead: findArticleDto.isRead,
      });
    }
    if (findArticleDto.link) {
      queryBuilder.andWhere('article.link = :link', { link: findArticleDto.link });
    }
    if (findArticleDto.pubDate) {
      queryBuilder.andWhere('article.pubDate = :pubDate', {
        pubDate: findArticleDto.pubDate,
      });
    }
    if (findArticleDto.id) {
      queryBuilder.andWhere('article.id = :id', { id: findArticleDto.id });
    }
    if (findArticleDto.subscriptionId) {
      queryBuilder.andWhere('subscription.id = :subscriptionId', {
        subscriptionId: findArticleDto.subscriptionId,
      });
    }
    if (findArticleDto.title) {
      queryBuilder.andWhere('article.title ILIKE :title', {
        title: `%${findArticleDto.title}%`,
      });
    }

    queryBuilder
      .orderBy('article.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [articles, total] = await queryBuilder.getManyAndCount();

    const paginatedArticles = new PaginationResponseDto<Article>(
      page,
      perPage,
      total,
      articles,
    );
    return paginatedArticles;
  }

  async batchUpdate(
    updateArticleDto: UpdateArticleDto,
  ): Promise<BatchUpdateResponseDto> {
    if (!updateArticleDto.ids || updateArticleDto.ids.length === 0) {
      this.logger.warn('Batch update called with no article IDs');
      return {
        updatedCount: 0,
        failedIds: [],
        message: 'No article IDs provided',
      };
    }

    ValidationUtil.validateUUIDs(updateArticleDto.ids, 'article IDs');

    this.logger.log(
      `Starting batch update for ${updateArticleDto.ids.length} articles`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const failedIds: string[] = [];
    const successIds: string[] = [];

    try {
      for (const id of updateArticleDto.ids) {
        try {
          const article = await queryRunner.manager.findOne(Article, {
            where: { id },
          });

          if (!article) {
            this.logger.warn(`Article not found: ${id}`);
            failedIds.push(id);
            continue;
          }

          if (updateArticleDto.isRead !== undefined) {
            article.isRead = updateArticleDto.isRead;
          }
          if (updateArticleDto.isFavorite !== undefined) {
            article.isFavorite = updateArticleDto.isFavorite;
          }

          await queryRunner.manager.save(article);
          successIds.push(id);
          this.logger.debug(`Successfully updated article: ${id}`);
        } catch (error) {
          this.logger.error(
            `Failed to update article ${id}: ${error.message}`,
            error.stack,
          );
          failedIds.push(id);
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `Batch update transaction committed: ${successIds.length} successful, ${failedIds.length} failed`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Batch update transaction rolled back: ${error.message}`,
        error.stack,
      );

      return {
        updatedCount: 0,
        failedIds: updateArticleDto.ids,
        message: `Transaction failed: ${error.message}`,
      };
    } finally {
      await queryRunner.release();
    }

    return {
      updatedCount: successIds.length,
      failedIds,
      message: `Updated ${successIds.length} articles, ${failedIds.length} failed`,
    };
  }

  private mapToResponseDto(article: Article): ArticleResponseDto {
    const responseDto = new ArticleResponseDto();
    Object.assign(responseDto, article);
    responseDto.articleId = article.id;
    responseDto.updatedAt = new Date().toDateString();
    return responseDto;
  }
}
