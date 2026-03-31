import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { FindArticleDto } from './dto/find-article.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { BatchUpdateResponseDto } from './dto/batch-update-response.dto';
import { ValidationUtil } from 'src/common/utils/validation.util';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search articles' })
  async searchArticles(
    @Query() searchDto: FindArticleDto,
  ): Promise<PaginationResponseDto<Article>> {
    this.logger.log(
      `Attempting to search articles with query: ${JSON.stringify(searchDto)}`,
    );
    return this.articlesService.find(searchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get articles' })
  async getAllArticles(
    @Query() findArticleDto: FindArticleDto,
  ): Promise<PaginationResponseDto<Article>> {
    this.logger.log(
      `Attempting to find articles: ${JSON.stringify(findArticleDto)}`,
    );
    return this.articlesService.find(findArticleDto);
  }

  @Patch('batch-update')
  @ApiOperation({ summary: 'Batch modify articles' })
  async batchUpdateArticles(
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<BatchUpdateResponseDto> {
    this.logger.log(
      `Attempting to batch update ${updateArticleDto.ids?.length || 0} articles`,
    );
    return await this.articlesService.batchUpdate(updateArticleDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by ID' })
  async getArticleById(@Param('id') id: string): Promise<Article> {
    if (!ValidationUtil.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID format for article id');
    }

    this.logger.log(`Attempting to find article by ID: ${id}`);
    const result = await this.articlesService.find({ id, page: 1, perPage: 1 });
    if (result.data.length === 0) {
      throw new NotFoundException(`Article not found: ${id}`);
    }
    return result.data[0];
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modify an article by ID' })
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    if (!ValidationUtil.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID format for article id');
    }

    this.logger.log(`Attempting to update article: ${id}`);
    return await this.articlesService.update(id, updateArticleDto);
  }
}
