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
var ArticlesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const article_entity_1 = require("./entities/article.entity");
const typeorm_2 = require("typeorm");
let ArticlesService = ArticlesService_1 = class ArticlesService {
    constructor(articleRepository) {
        this.articleRepository = articleRepository;
        this.logger = new common_1.Logger(ArticlesService_1.name);
    }
    async getArticlesBySubId(subscriptionId) {
        this.logger.log(`Attempting to get articles: ${subscriptionId}`);
        try {
            const articles = await this.articleRepository.find({
                where: { subscription: { id: subscriptionId } },
                order: { pubDate: 'DESC' },
            });
            return articles;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error retrieving article with ID ${subscriptionId}: ${error.message}`);
            throw new common_1.InternalServerErrorException(`Failed to retrieve article: ${error.message}`);
        }
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = ArticlesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map