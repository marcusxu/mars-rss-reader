import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { FindArticleDto } from './dto/find-article.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get articles' })
  async getAllSubscriptions(
    @Query() findArticleDto: FindArticleDto,
  ): Promise<PaginationResponseDto<Article>> {
    this.logger.log(
      `Attempting to find subscriptions: ${JSON.stringify(findArticleDto)}`,
    );
    return this.articlesService.find(findArticleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modify a article by ID' })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    this.logger.log(`Attempting to update article: ${id}`);
    return await this.articlesService.update(id, updateArticleDto);
  }
}
