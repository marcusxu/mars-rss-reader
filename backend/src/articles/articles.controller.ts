import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';

@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('subscription/:subId')
  @ApiOperation({ summary: 'Get articles for a subscription' })
  @ApiParam({ name: 'subId', description: 'Subscription ID' })
  @ApiResponse({
    status: 200,
    description: 'Return articles for the subscription',
    type: [Article],
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async getArticlesForSubscription(
    @Param('subId') subId: string,
  ): Promise<Article[]> {
    this.logger.log(`Attempting to get articles for subscription: ${subId}`);
    try {
      return await this.articlesService.getArticlesBySubId(subId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Subscription not found',
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  // TODO: @Get()
  // TODO: @Get(':id')
}
