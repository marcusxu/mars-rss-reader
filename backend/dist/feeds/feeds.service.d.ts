import { Repository } from 'typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
export declare class FeedsService {
    private articlesRepository;
    private subscriptionsRepository;
    private parser;
    private readonly logger;
    constructor(articlesRepository: Repository<Article>, subscriptionsRepository: Repository<Subscription>);
    update(subscriptionId: string): Promise<Article[]>;
    private fetchArticles;
    private saveArticles;
    private createArticleFromFeedItem;
    cleanupArticles(subscriptionId: string): Promise<void>;
}
