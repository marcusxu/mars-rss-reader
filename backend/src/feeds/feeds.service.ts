import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import Parser from 'rss-parser';
import axios from 'axios';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { FeedResponseDto } from './dto/feed-response.dto';

@Injectable()
export class FeedsService {
  private parser: Parser;
  private readonly logger = new Logger(FeedsService.name);

  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {
    this.parser = new Parser();
  }

  async update(subscriptionId: string): Promise<FeedResponseDto> {
    this.logger.log(`Attempting to update a feed: ${subscriptionId}`);
    const subscription = await this.getSubscriptionById(subscriptionId);
    const feed = await this.fetchArticles(subscription.url);
    const articles = feed.items.map((item) =>
      this.createArticleFromFeedItem(item, subscription),
    );

    const savedArticles = await this.saveArticles(articles);
    this.logger.log(`Successfully updated subscription: ${subscriptionId}`);
    return this.mapToResponseDto(subscriptionId, savedArticles.length);
  }

  private async fetchArticles(url: string): Promise<any> {
    const response = await axios.get(url);
    return await this.parser.parseString(response.data);
  }

  private async saveArticles(articles: Article[]): Promise<Article[]> {
    this.logger.log(`Attempting to save articles: ${articles}`);
    const savedArticles: Article[] = [];
    for (const article of articles) {
      const existingArticle = await this.articlesRepository.findOne({
        where: { link: article.link },
      });
      if (!existingArticle) {
        savedArticles.push(await this.articlesRepository.save(article));
      }
    }
    return savedArticles;
  }

  private createArticleFromFeedItem(
    item: any,
    subscription: Subscription,
  ): Article {
    const article = new Article();
    article.title = item.title;
    article.link = item.link;
    article.content = item.content;
    article.pubDate = new Date(item.pubDate);
    article.subscription = subscription;
    return article;
  }

  async cleanupArticles(subscriptionId: string): Promise<FeedResponseDto> {
    this.logger.log(`Attempting to cleanup articles: ${subscriptionId}`);
    await this.getSubscriptionById(subscriptionId);
    const result = await this.articlesRepository.delete({
      subscription: { id: subscriptionId },
    });
    this.logger.log(
      `Successfully cleaned up ${result.affected} articles for the subscription: ${subscriptionId}`,
    );
    return this.mapToResponseDto(subscriptionId, result.affected);
  }

  private async getSubscriptionById(
    subscriptionId: string,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id: subscriptionId },
    });
    if (!subscription) {
      this.logger.warn(`Subscription not found: ${subscriptionId}`);
      throw new NotFoundException(`Subscription not found: ${subscriptionId}`);
    }
    return subscription;
  }

  private mapToResponseDto(
    subscriptionId: string,
    articlesCount: number,
  ): FeedResponseDto {
    const responseDto = new FeedResponseDto();
    responseDto.subscriptionId = subscriptionId;
    responseDto.updatedAt = new Date().toDateString();
    responseDto.articlesCount = articlesCount;
    return responseDto;
  }
}
