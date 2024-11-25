import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async getArticlesBySubId(subscriptionId: string): Promise<Article[]> {
    this.logger.log(`Attempting to get articles: ${subscriptionId}`);
    try {
      const articles = await this.articleRepository.find({
        where: { subscription: { id: subscriptionId } },
        order: { pubDate: 'DESC' },
      });
      return articles;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error retrieving article with ID ${subscriptionId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to retrieve article: ${error.message}`,
      );
    }
  }
  // TODO: getArticles
  // TODO: updateArticleReadStatus
}
