"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FeedsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const article_entity_1 = require("../articles/entities/article.entity");
const rss_parser_1 = __importDefault(require("rss-parser"));
const axios_1 = __importDefault(require("axios"));
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
let FeedsService = FeedsService_1 = class FeedsService {
    constructor(articlesRepository, subscriptionsRepository) {
        this.articlesRepository = articlesRepository;
        this.subscriptionsRepository = subscriptionsRepository;
        this.logger = new common_1.Logger(FeedsService_1.name);
        this.parser = new rss_parser_1.default();
    }
    async update(subscriptionId) {
        this.logger.log(`Attempting to update a feed: ${subscriptionId}`);
        try {
            const subscription = await this.subscriptionsRepository.findOne({
                where: { id: subscriptionId },
            });
            if (!subscription) {
                this.logger.warn(`Subscription not found: ${subscriptionId}`);
                throw new common_1.NotFoundException(`Subscription not found: ${subscriptionId}`);
            }
            const feed = await this.fetchArticles(subscription.url);
            const articles = feed.items.map((item) => this.createArticleFromFeedItem(item, subscription));
            const savedArticles = await this.saveArticles(articles);
            this.logger.log(`Successfully updated subscription: ${subscriptionId}`);
            return savedArticles;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to update feed: ${subscriptionId}`);
        }
    }
    async fetchArticles(url) {
        try {
            const response = await axios_1.default.get(url);
            return await this.parser.parseString(response.data);
        }
        catch (error) {
            this.logger.error(`Failed to fetch feed from ${url}: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to fetch feed from ${url}: ${error.message}`);
        }
    }
    async saveArticles(articles) {
        this.logger.log(`Attempting to save articles: ${articles}`);
        const savedArticles = [];
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
        }
        catch (error) {
            this.logger.error(`Error saving articles: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to save articles: ${error.message}`);
        }
    }
    createArticleFromFeedItem(item, subscription) {
        const article = new article_entity_1.Article();
        article.title = item.title;
        article.link = item.link;
        article.content = item.content;
        article.pubDate = new Date(item.pubDate);
        article.subscription = subscription;
        return article;
    }
    async cleanupArticles(subscriptionId) {
        this.logger.log(`Attempting to cleanup articles: ${subscriptionId}`);
        try {
            const articles = await this.articlesRepository.find({
                where: { subscription: { id: subscriptionId } },
            });
            for (const article of articles) {
                await this.articlesRepository.remove(article);
            }
        }
        catch (error) {
            this.logger.error(`Error cleaning up articles for subscription ${subscriptionId}: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to cleanup articles: ${error.message}`);
        }
    }
};
exports.FeedsService = FeedsService;
exports.FeedsService = FeedsService = FeedsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(article_entity_1.Article)),
    __param(1, (0, typeorm_2.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], FeedsService);
//# sourceMappingURL=feeds.service.js.map