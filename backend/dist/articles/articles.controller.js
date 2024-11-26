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
var ArticlesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const articles_service_1 = require("./articles.service");
const article_entity_1 = require("./entities/article.entity");
let ArticlesController = ArticlesController_1 = class ArticlesController {
    constructor(articlesService) {
        this.articlesService = articlesService;
        this.logger = new common_1.Logger(ArticlesController_1.name);
    }
    async getArticlesForSubscription(subId) {
        this.logger.log(`Attempting to get articles for subscription: ${subId}`);
        try {
            return await this.articlesService.getArticlesBySubId(subId);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'Subscription not found',
                    message: error.message,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
};
exports.ArticlesController = ArticlesController;
__decorate([
    (0, common_1.Get)('subscription/:subId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get articles for a subscription' }),
    (0, swagger_1.ApiParam)({ name: 'subId', description: 'Subscription ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return articles for the subscription',
        type: [article_entity_1.Article],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscription not found' }),
    __param(0, (0, common_1.Param)('subId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "getArticlesForSubscription", null);
exports.ArticlesController = ArticlesController = ArticlesController_1 = __decorate([
    (0, common_1.Controller)('articles'),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
//# sourceMappingURL=articles.controller.js.map