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

  // Configuration constants
  private readonly BATCH_SIZE = 5; // Maximum concurrent RSS feed updates
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_REDIRECTS = 5;

  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {
    this.parser = new Parser();
  }

  async update(subscriptionId: string): Promise<FeedResponseDto> {
    const startTime = Date.now();
    this.logger.log(
      `Attempting to update feed for subscription: ${subscriptionId}`,
    );

    try {
      const subscription = await this.getSubscriptionById(subscriptionId);
      this.logger.debug(
        `Found subscription: ${subscription.name} (${subscription.url})`,
      );

      const feed = await this.fetchArticles(subscription.url);
      this.logger.debug(
        `Fetched ${feed.items?.length || 0} items from RSS feed`,
      );

      if (!feed.items || feed.items.length === 0) {
        this.logger.warn(
          `No articles found in RSS feed for subscription: ${subscriptionId}`,
        );
        return this.mapToResponseDto(subscriptionId, 0);
      }

      const articles = feed.items
        .filter((item) => item && item.title && item.link)
        .map((item) => this.createArticleFromFeedItem(item, subscription));

      this.logger.debug(`Parsed ${articles.length} valid articles`);
      const savedArticles = await this.saveArticles(articles);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Successfully updated subscription ${subscriptionId}: ${savedArticles.length} new articles in ${duration}ms`,
      );
      return this.mapToResponseDto(subscriptionId, savedArticles.length);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Failed to update subscription ${subscriptionId} after ${duration}ms: ${error.message}`,
      );
      throw error;
    }
  }

  async updateAll(): Promise<FeedResponseDto> {
    this.logger.log(`Attempting to update articles for all subscriptions`);
    const subscriptions = await this.subscriptionsRepository.find();

    if (subscriptions.length === 0) {
      this.logger.warn('No subscriptions found to update');
      return this.mapToResponseDto(null, 0);
    }

    this.logger.log(`Found ${subscriptions.length} subscriptions to update`);

    let totalUpdatedCount = 0;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < subscriptions.length; i += this.BATCH_SIZE) {
      const batch = subscriptions.slice(i, i + this.BATCH_SIZE);
      const batchPromises = batch.map(async (subscription) => {
        try {
          const result = await this.update(subscription.id);
          successCount++;
          return result.articlesCount;
        } catch (error) {
          failCount++;
          this.logger.error(
            `Failed to update subscription ${subscription.id} (${subscription.name}): ${error.message}`,
          );
          return 0;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      totalUpdatedCount += batchResults.reduce((sum, count) => sum + count, 0);

      this.logger.log(
        `Batch ${Math.floor(i / this.BATCH_SIZE) + 1} completed: ${batchResults.reduce((a, b) => a + b, 0)} articles`,
      );
    }

    this.logger.log(
      `Update completed: ${totalUpdatedCount} articles updated, ${successCount} successful, ${failCount} failed`,
    );
    return this.mapToResponseDto(null, totalUpdatedCount);
  }

  async cleanupAll(): Promise<FeedResponseDto> {
    this.logger.log(`Attempting to cleanup articles for all subscriptions`);
    const subscriptions = await this.subscriptionsRepository.find();

    if (subscriptions.length === 0) {
      this.logger.warn('No subscriptions found to cleanup');
      return this.mapToResponseDto(null, 0);
    }

    this.logger.log(`Found ${subscriptions.length} subscriptions to cleanup`);

    const cleanupPromises = subscriptions.map(async (subscription) => {
      try {
        const result = await this.cleanupArticles(subscription.id);
        return result.articlesCount;
      } catch (error) {
        this.logger.error(
          `Failed to cleanup subscription ${subscription.id} (${subscription.name}): ${error.message}`,
        );
        return 0;
      }
    });

    const results = await Promise.allSettled(cleanupPromises);
    const totalDeletedCount = results
      .filter(
        (result): result is PromiseFulfilledResult<number> =>
          result.status === 'fulfilled',
      )
      .reduce((sum, result) => sum + result.value, 0);

    const failedCount = results.filter(
      (result) => result.status === 'rejected',
    ).length;

    this.logger.log(
      `Cleanup completed: ${totalDeletedCount} articles deleted, ${failedCount} failures`,
    );
    return this.mapToResponseDto(null, totalDeletedCount);
  }

  private async fetchArticles(url: string): Promise<any> {
    // Validate URL format
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL: URL must be a non-empty string');
    }

    try {
      new URL(url); // Validate URL format
    } catch {
      throw new Error(`Invalid URL format: ${url}`);
    }

    try {
      this.logger.debug(`Fetching RSS feed from: ${url}`);

      const response = await axios.get(url, {
        timeout: this.REQUEST_TIMEOUT,
        headers: {
          'User-Agent': 'Mars RSS Reader/1.0 (RSS Feed Parser)',
          Accept: 'application/rss+xml, application/xml, text/xml, */*',
        },
        maxRedirects: this.MAX_REDIRECTS,
        validateStatus: (status) => status >= 200 && status < 300,
      });

      if (!response.data) {
        throw new Error('Empty response from RSS feed');
      }

      const feed = await this.parser.parseString(response.data);
      this.logger.debug(
        `Successfully parsed RSS feed: ${feed.title || 'Unknown'}`,
      );

      return feed;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error(`RSS feed request timeout for URL: ${url}`);
      } else if (error.response) {
        throw new Error(
          `RSS feed request failed with status ${error.response.status}: ${url}`,
        );
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot reach RSS feed URL: ${url}`);
      } else {
        throw new Error(
          `Failed to fetch RSS feed from ${url}: ${error.message}`,
        );
      }
    }
  }

  private async saveArticles(articles: Article[]): Promise<Article[]> {
    if (articles.length === 0) {
      this.logger.debug('No articles to save');
      return [];
    }

    this.logger.debug(`Attempting to save ${articles.length} articles`);

    const articleLinks = articles.map((a) => a.link);
    const existingArticles = await this.articlesRepository.find({
      where: articleLinks.map((link) => ({ link })),
      select: ['link'],
    });

    const existingLinks = new Set(existingArticles.map((a) => a.link));
    const newArticles = articles.filter(
      (article) => !existingLinks.has(article.link),
    );

    if (newArticles.length === 0) {
      this.logger.debug('All articles already exist, skipping save');
      return [];
    }

    this.logger.debug(
      `Saving ${newArticles.length} new articles (${existingLinks.size} duplicates skipped)`,
    );

    try {
      const savedArticles = await this.articlesRepository.save(newArticles);
      this.logger.debug(
        `Successfully saved ${savedArticles.length} new articles`,
      );
      return savedArticles;
    } catch (error) {
      this.logger.error(`Failed to save articles: ${error.message}`);
      const savedArticles: Article[] = [];
      for (const article of newArticles) {
        try {
          const saved = await this.articlesRepository.save(article);
          savedArticles.push(saved);
        } catch (saveError) {
          this.logger.warn(
            `Failed to save article "${article.title}": ${saveError.message}`,
          );
        }
      }
      return savedArticles;
    }
  }

  private createArticleFromFeedItem(
    item: any,
    subscription: Subscription,
  ): Article {
    const article = new Article();

    article.title = (item.title || item.summary || 'Untitled')
      .trim()
      .substring(0, 500);
    article.link = item.link || item.guid || '';
    article.content = (
      item.content ||
      item.contentSnippet ||
      item.summary ||
      ''
    ).trim();
    article.author =
      (item.author || item.creator || '').trim().substring(0, 255) || null;

    if (item.pubDate || item.isoDate) {
      try {
        article.pubDate = new Date(item.pubDate || item.isoDate);
        if (isNaN(article.pubDate.getTime())) {
          article.pubDate = new Date();
        }
      } catch {
        article.pubDate = new Date();
      }
    } else {
      article.pubDate = new Date();
    }

    article.subscription = subscription;
    article.isRead = false;
    article.isFavorite = false;

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
