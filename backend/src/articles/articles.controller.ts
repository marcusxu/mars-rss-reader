import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by ID' })
  async getArticleById(@Param('id') id: string): Promise<Article> {
    this.logger.log(`Attempting to find article by ID: ${id}`);
    const result = await this.articlesService.find({ id, page: 1, perPage: 1 });
    if (result.data.length === 0) {
      throw new NotFoundException(`Article not found: ${id}`);
    }
    return result.data[0];
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

  @Patch(':id')
  @ApiOperation({ summary: 'Modify an article by ID' })
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    this.logger.log(`Attempting to update article: ${id}`);
    return await this.articlesService.update(id, updateArticleDto);
  }

  @Patch('batch')
  @ApiOperation({ summary: 'Batch modify articles by ID' })
  async batchUpdateArticles(
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<{ updatedCount: number; failedIds: string[]; message: string }> {
    this.logger.log(
      `Attempting to batch update ${updateArticleDto.ids?.length || 0} articles`,
    );

    if (!updateArticleDto.ids || updateArticleDto.ids.length === 0) {
      return {
        updatedCount: 0,
        failedIds: [],
        message: 'No article IDs provided',
      };
    }

    const failedIds: string[] = [];
    let updatedCount = 0;
    const results = await Promise.allSettled(
      updateArticleDto.ids.map(async (id) => {
        try {
          await this.articlesService.update(id, {
            isRead: updateArticleDto.isRead,
            isFavorite: updateArticleDto.isFavorite,
          });
          return { success: true, id };
        } catch (error) {
          this.logger.warn(`Failed to update article ${id}: ${error.message}`);
          return { success: false, id, error: error.message };
        }
      }),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        updatedCount++;
      } else {
        failedIds.push(updateArticleDto.ids[index]);
      }
    });

    this.logger.log(
      `Batch update completed: ${updatedCount} successful, ${failedIds.length} failed`,
    );
    return {
      updatedCount,
      failedIds,
      message: `Updated ${updatedCount} articles, ${failedIds.length} failed`,
    };
  }
}
