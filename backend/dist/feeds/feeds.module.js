"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedsModule = void 0;
const common_1 = require("@nestjs/common");
const feeds_service_1 = require("./feeds.service");
const feeds_controller_1 = require("./feeds.controller");
const typeorm_1 = require("@nestjs/typeorm");
const article_entity_1 = require("../articles/entities/article.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
let FeedsModule = class FeedsModule {
};
exports.FeedsModule = FeedsModule;
exports.FeedsModule = FeedsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([article_entity_1.Article, subscription_entity_1.Subscription])],
        providers: [feeds_service_1.FeedsService],
        controllers: [feeds_controller_1.FeedsController],
    })
], FeedsModule);
//# sourceMappingURL=feeds.module.js.map