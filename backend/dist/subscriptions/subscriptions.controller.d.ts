import { SubscriptionsService } from './subscriptions.service';
import { BaseSubscriptionDto } from './dto/base-subscription.dto';
import { Subscription } from './entities/subscription.entity';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    private readonly logger;
    constructor(subscriptionsService: SubscriptionsService);
    createSubscription(createSubscriptionDto: BaseSubscriptionDto): Promise<Subscription>;
    deleteSubscription(id: string): Promise<void>;
    updateSubscription(id: string, updateSubscriptionDto: BaseSubscriptionDto): Promise<Subscription>;
    getAllSubscriptions(id?: string, url?: string, name?: string, category?: string): Promise<Subscription[]>;
}
