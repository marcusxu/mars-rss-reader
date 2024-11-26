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
var FeedsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const article_entity_1 = require("../articles/entities/article.entity");
const feeds_service_1 = require("./feeds.service");
let FeedsController = FeedsController_1 = class FeedsController {
    constructor(feedsService) {
        this.feedsService = feedsService;
        this.logger = new common_1.Logger(FeedsController_1.name);
    }
    async updateSubscriptionArticles(id) {
        this.logger.log(`Attempting to update articles for subscription: ${id}`);
        try {
            return await this.feedsService.update(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'Subscription not found',
                    message: error.message,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            this.logger.error(`Error updating articles for subscription ${id}: ${error.message}`);
            throw new common_1.InternalServerErrorException('An error occurred while updating articles');
        }
    }
    async removeSubscription(id) {
        this.logger.log(`Attempting to delete subscription: ${id}`);
        try {
            await this.feedsService.cleanupArticles(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'Subscription not found',
                    message: error.message,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            this.logger.error(`Error deleting articles for subscription ${id}: ${error.message}`);
            throw new common_1.InternalServerErrorException('An error occurred while deleting articles');
        }
    }
};
exports.FeedsController = FeedsController;
__decorate([
    (0, common_1.Patch)('update/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update articles for a subscription' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Subscription ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Articles updated successfully',
        type: [article_entity_1.Article],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscription not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedsController.prototype, "updateSubscriptionArticles", null);
__decorate([
    (0, common_1.Patch)('cleanup/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a subscription' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Subscription ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Articles deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscription not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedsController.prototype, "removeSubscription", null);
exports.FeedsController = FeedsController = FeedsController_1 = __decorate([
    (0, swagger_1.ApiTags)('feeds'),
    (0, common_1.Controller)('feeds'),
    __metadata("design:paramtypes", [feeds_service_1.FeedsService])
], FeedsController);
//# sourceMappingURL=feeds.controller.js.map