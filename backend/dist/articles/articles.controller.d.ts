import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
export declare class ArticlesController {
    private readonly articlesService;
    private readonly logger;
    constructor(articlesService: ArticlesService);
    getArticlesForSubscription(subId: string): Promise<Article[]>;
}
