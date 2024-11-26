import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { BaseSubscriptionDto } from './dto/base-subscription.dto';
export declare class SubscriptionsService {
    private subscriptionsRepository;
    private readonly logger;
    constructor(subscriptionsRepository: Repository<Subscription>);
    create(createSubscriptionDto: BaseSubscriptionDto): Promise<Subscription>;
    remove(id: string): Promise<void>;
    update(id: string, updateSubscriptionDto: BaseSubscriptionDto): Promise<Subscription>;
    find(query: Partial<Subscription>): Promise<Subscription[]>;
}
