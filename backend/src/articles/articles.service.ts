import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { FindArticleDto } from './dto/find-article.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
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
    const page = findArticleDto?.page || 1;
    const perPage = findArticleDto?.perPage || 10;

    this.logger.log(
      `Attempting to find article: ${JSON.stringify(findArticleDto)}, page: ${page}, perPage: ${perPage}`,
    );
    const where: FindOptionsWhere<Article> = {};
    if (findArticleDto.author)
      where.author = ILike(`%${findArticleDto.author}%`);
    if (findArticleDto.content)
      where.content = ILike(`%${findArticleDto.content}%`);
    if (findArticleDto.isFavorite) where.isFavorite = findArticleDto.isFavorite;
    if (findArticleDto.isRead) where.isRead = findArticleDto.isRead;
    if (findArticleDto.link) where.link = findArticleDto.link;
    if (findArticleDto.pubDate) where.pubDate = findArticleDto.pubDate;
    if (findArticleDto.id) where.id = findArticleDto.id;
    if (findArticleDto.subscriptionId)
      where.subscription = { id: findArticleDto.subscriptionId };
    if (findArticleDto.title) where.title = ILike(`%${findArticleDto.title}%`);

    const [articles, total] = await this.articleRepository.findAndCount({
      where: where,
      skip: (page - 1) * perPage,
      take: perPage,
      order: { createdAt: 'DESC' },
    });
    if (articles?.length === 0) {
      this.logger.warn(
        `No articles found matching the criteria: ${JSON.stringify(findArticleDto)}`,
      );
      throw new NotFoundException('No articles found matching the criteria');
    }

    const paginatedArticles = new PaginationResponseDto<Article>(
      page,
      perPage,
      total,
      articles,
    );
    return paginatedArticles;
  }

  private mapToResponseDto(article: Article): ArticleResponseDto {
    const responseDto = new ArticleResponseDto();
    Object.assign(responseDto, article);
    responseDto.articleId = article.id;
    responseDto.updatedAt = new Date().toDateString();
    return responseDto;
  }
}
