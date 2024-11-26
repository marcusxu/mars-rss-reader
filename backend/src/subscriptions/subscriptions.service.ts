import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { BaseSubscriptionDto } from './dto/base-subscription.dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(
    createSubscriptionDto: BaseSubscriptionDto,
  ): Promise<Subscription> {
    this.logger.log(`Attempting to create a new subscription`);
    if (!createSubscriptionDto.url) {
      this.logger.warn(`Invalid subscription data: no URL`);
      throw new BadRequestException('Invalid subscription data');
    }
    const existingSubscription = await this.subscriptionsRepository.findOne({
      where: { url: createSubscriptionDto.url },
    });
    if (existingSubscription) {
      this.logger.warn(
        `Subscription with URL already exists: ${createSubscriptionDto.url}`,
      );
      throw new ConflictException(
        `Subscription with URL already exists: ${createSubscriptionDto.url}`,
      );
    }
    const newSubscription = this.subscriptionsRepository.create(
      createSubscriptionDto,
    );
    await this.subscriptionsRepository.save(newSubscription);
    this.logger.log(`Created new subscription with ID: ${newSubscription.id}`);
    return newSubscription;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Attempting to remove subscription: ${id}`);
    const result = await this.subscriptionsRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Subscription not found: ${id}`);
      throw new NotFoundException(`Subscription not found: ${id}`);
    }
    this.logger.log(`Successfully removed subscription: ${id}`);
  }

  async update(
    id: string,
    updateSubscriptionDto: BaseSubscriptionDto,
  ): Promise<Subscription> {
    this.logger.log(`Attempting to update subscription: ${id}`);
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
    });
    if (!subscription) {
      this.logger.warn(`Subscription not found: ${id}`);
      throw new NotFoundException(`Subscription not found: ${id}`);
    }
    Object.assign(subscription, updateSubscriptionDto);
    const updatedSubscription =
      await this.subscriptionsRepository.save(subscription);
    this.logger.log(`Successfully updated subscription: ${id}`);
    return updatedSubscription;
  }

  async find(query: Partial<Subscription>): Promise<Subscription[]> {
    this.logger.log(
      `Attempting to find subscription: ${JSON.stringify(query)}`,
    );

    const subscriptions = await this.subscriptionsRepository.find({
      where: query,
    });
    if (subscriptions?.length === 0) {
      this.logger.warn(
        `No subscriptions found matching the criteria: ${JSON.stringify(query)}`,
      );
      throw new NotFoundException(
        'No subscriptions found matching the criteria',
      );
    }

    return subscriptions;
  }
}
