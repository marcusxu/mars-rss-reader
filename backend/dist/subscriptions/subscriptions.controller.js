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
var SubscriptionsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_service_1 = require("./subscriptions.service");
const swagger_1 = require("@nestjs/swagger");
const base_subscription_dto_1 = require("./dto/base-subscription.dto");
let SubscriptionsController = SubscriptionsController_1 = class SubscriptionsController {
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
        this.logger = new common_1.Logger(SubscriptionsController_1.name);
    }
    async createSubscription(createSubscriptionDto) {
        this.logger.log(`Attempting to create a new subscription`);
        try {
            return this.subscriptionsService.create(createSubscriptionDto);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.CONFLICT,
                    error: 'Duplicate subscription',
                    message: error.message,
                }, common_1.HttpStatus.CONFLICT);
            }
            throw error;
        }
    }
    async deleteSubscription(id) {
        this.logger.log(`Attempting to remove subscription: ${id}`);
        try {
            await this.subscriptionsService.remove(id);
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
    async updateSubscription(id, updateSubscriptionDto) {
        this.logger.log(`Attempting to remove subscription: ${id}`);
        try {
            return await this.subscriptionsService.update(id, updateSubscriptionDto);
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
    async getAllSubscriptions(id, url, name, category) {
        if (id || url || name || category) {
            this.logger.log(`Attempting to find subscriptions with params: id=${id}, url=${url}, name=${name}, category=${category}`);
            return this.subscriptionsService.find({
                id,
                url,
                name,
                category,
            });
        }
        else {
            this.logger.log(`Attempting to find all subscriptions`);
            return this.subscriptionsService.find({});
        }
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a subscription' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_subscription_dto_1.BaseSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a subscription by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "deleteSubscription", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify a subscription by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_subscription_dto_1.BaseSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscriptions' }),
    (0, swagger_1.ApiQuery)({ name: 'id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'url', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('url')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "getAllSubscriptions", null);
exports.SubscriptionsController = SubscriptionsController = SubscriptionsController_1 = __decorate([
    (0, swagger_1.ApiTags)('subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map