import { Article } from 'src/articles/entities/article.entity';
import { FeedsService } from './feeds.service';
export declare class FeedsController {
    private readonly feedsService;
    private readonly logger;
    constructor(feedsService: FeedsService);
    updateSubscriptionArticles(id: string): Promise<Article[]>;
    removeSubscription(id: string): Promise<void>;
}
