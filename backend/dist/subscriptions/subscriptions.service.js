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
var SubscriptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("./entities/subscription.entity");
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    constructor(subscriptionsRepository) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.logger = new common_1.Logger(SubscriptionsService_1.name);
    }
    async create(createSubscriptionDto) {
        this.logger.log(`Attempting to create a new subscription`);
        if (!createSubscriptionDto.url) {
            this.logger.warn(`Invalid subscription data: no URL`);
            throw new common_1.BadRequestException('Invalid subscription data');
        }
        const existingSubscription = await this.subscriptionsRepository.findOne({
            where: { url: createSubscriptionDto.url },
        });
        if (existingSubscription) {
            this.logger.warn(`Subscription with URL already exists: ${createSubscriptionDto.url}`);
            throw new common_1.ConflictException(`Subscription with URL already exists: ${createSubscriptionDto.url}`);
        }
        const newSubscription = this.subscriptionsRepository.create(createSubscriptionDto);
        await this.subscriptionsRepository.save(newSubscription);
        this.logger.log(`Created new subscription with ID: ${newSubscription.id}`);
        return newSubscription;
    }
    async remove(id) {
        this.logger.log(`Attempting to remove subscription: ${id}`);
        const result = await this.subscriptionsRepository.delete(id);
        if (result.affected === 0) {
            this.logger.warn(`Subscription not found: ${id}`);
            throw new common_1.NotFoundException(`Subscription not found: ${id}`);
        }
        this.logger.log(`Successfully removed subscription: ${id}`);
    }
    async update(id, updateSubscriptionDto) {
        this.logger.log(`Attempting to update subscription: ${id}`);
        const subscription = await this.subscriptionsRepository.findOne({
            where: { id },
        });
        if (!subscription) {
            this.logger.warn(`Subscription not found: ${id}`);
            throw new common_1.NotFoundException(`Subscription not found: ${id}`);
        }
        Object.assign(subscription, updateSubscriptionDto);
        const updatedSubscription = await this.subscriptionsRepository.save(subscription);
        this.logger.log(`Successfully updated subscription: ${id}`);
        return updatedSubscription;
    }
    async find(query) {
        this.logger.log(`Attempting to find subscription: ${JSON.stringify(query)}`);
        const subscriptions = await this.subscriptionsRepository.find({
            where: query,
        });
        if (subscriptions?.length === 0) {
            this.logger.warn(`No subscriptions found matching the criteria: ${JSON.stringify(query)}`);
            throw new common_1.NotFoundException('No subscriptions found matching the criteria');
        }
        return subscriptions;
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map