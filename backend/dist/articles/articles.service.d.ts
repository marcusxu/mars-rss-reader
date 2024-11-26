import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
export declare class ArticlesService {
    private articleRepository;
    private readonly logger;
    constructor(articleRepository: Repository<Article>);
    getArticlesBySubId(subscriptionId: string): Promise<Article[]>;
}
