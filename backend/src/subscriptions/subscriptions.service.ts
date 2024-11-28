import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dt';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { FindSubscriptionDto } from './dto/find-subscription.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';
import { PaginationRequestDto } from 'src/common/pagination/pagination-request.dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(`Attempting to create a new subscription`);
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
    return this.mapToResponseDto(newSubscription);
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
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
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
    return this.mapToResponseDto(updatedSubscription);
  }

  async find(
    findSubscriptionDto: FindSubscriptionDto,
  ): Promise<PaginationResponseDto<Subscription>> {
    const page = findSubscriptionDto?.page || 1;
    const perPage = findSubscriptionDto?.perPage || 10;

    this.logger.log(
      `Attempting to find subscription: ${JSON.stringify(findSubscriptionDto)}, page: ${page}, perPage: ${perPage}`,
    );
    const where: FindOptionsWhere<Subscription> = {};
    if (findSubscriptionDto.id) where.id = findSubscriptionDto.id;
    if (findSubscriptionDto.category)
      where.category = findSubscriptionDto.category;
    if (findSubscriptionDto.description)
      where.description = ILike(`%${findSubscriptionDto.description}%`);
    if (findSubscriptionDto.name)
      where.name = ILike(`%${findSubscriptionDto.name}%`);

    const [subscriptions, total] =
      await this.subscriptionsRepository.findAndCount({
        where: where,
        skip: (page - 1) * perPage,
        take: perPage,
        order: { createdAt: 'DESC' },
      });
    if (subscriptions?.length === 0) {
      this.logger.warn(
        `No subscriptions found matching the criteria: ${JSON.stringify(findSubscriptionDto)}`,
      );
      throw new NotFoundException(
        'No subscriptions found matching the criteria',
      );
    }

    const paginatedSubscriptions = new PaginationResponseDto<Subscription>(
      page,
      perPage,
      total,
      subscriptions,
    );
    return paginatedSubscriptions;
  }

  private mapToResponseDto(
    subscription: Subscription,
  ): SubscriptionResponseDto {
    const responseDto = new SubscriptionResponseDto();
    Object.assign(responseDto, subscription);
    responseDto.createdAt = subscription.createdAt.toDateString();
    responseDto.updatedAt = subscription.updatedAt.toDateString();
    return responseDto;
  }
}
