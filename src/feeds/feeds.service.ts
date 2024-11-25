import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import Parser from 'rss-parser';
import axios from 'axios';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

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

  async update(subscriptionId: string): Promise<Article[]> {
    this.logger.log(`Attempting to update a feed: ${subscriptionId}`);
    try {
      const subscription = await this.subscriptionsRepository.findOne({
        where: { id: subscriptionId },
      });
      if (!subscription) {
        this.logger.warn(`Subscription not found: ${subscriptionId}`);
        throw new NotFoundException(
          `Subscription not found: ${subscriptionId}`,
        );
      }
      const feed = await this.fetchArticles(subscription.url);
      const articles = feed.items.map((item) =>
        this.createArticleFromFeedItem(item, subscription),
      );

      const savedArticles = await this.saveArticles(articles);
      this.logger.log(`Successfully updated subscription: ${subscriptionId}`);
      return savedArticles;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update feed: ${subscriptionId}`,
      );
    }
  }

  private async fetchArticles(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return await this.parser.parseString(response.data);
    } catch (error) {
      this.logger.error(`Failed to fetch feed from ${url}: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to fetch feed from ${url}: ${error.message}`,
      );
    }
  }

  private async saveArticles(articles: Article[]): Promise<Article[]> {
    this.logger.log(`Attempting to save articles: ${articles}`);
    const savedArticles: Article[] = [];
    try {
      for (const article of articles) {
        const existingArticle = await this.articlesRepository.findOne({
          where: { link: article.link },
        });
        if (!existingArticle) {
          savedArticles.push(await this.articlesRepository.save(article));
        }
      }
      return savedArticles;
    } catch (error) {
      this.logger.error(`Error saving articles: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to save articles: ${error.message}`,
      );
    }
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

  async cleanupArticles(subscriptionId: string): Promise<void> {
    this.logger.log(`Attempting to cleanup articles: ${subscriptionId}`);
    try {
      const articles = await this.articlesRepository.find({
        where: { subscription: { id: subscriptionId } },
      });
      for (const article of articles) {
        await this.articlesRepository.remove(article);
      }
    } catch (error) {
      this.logger.error(
        `Error cleaning up articles for subscription ${subscriptionId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to cleanup articles: ${error.message}`,
      );
    }
  }
}
