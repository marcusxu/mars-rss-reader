import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { FindSubscriptionDto } from './dto/find-subscription.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';
import { DeleteSubscriptionResponseDto } from './dto/delete-subscription-response.dto';
import { ValidationUtil } from 'src/common/utils/validation.util';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a subscription' })
  @ApiBody({ type: CreateSubscriptionDto })
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(
      `Attempting to create a new subscription: ${JSON.stringify(createSubscriptionDto)}`,
    );
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a subscription by ID' })
  async deleteSubscription(
    @Param('id') id: string,
  ): Promise<DeleteSubscriptionResponseDto> {
    if (!ValidationUtil.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID format for subscription id');
    }

    this.logger.log(`Attempting to remove subscription: ${id}`);
    const result = await this.subscriptionsService.remove(id);
    return result;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modify a subscription by ID' })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    if (!ValidationUtil.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID format for subscription id');
    }

    this.logger.log(`Attempting to update subscription: ${id}`);
    return await this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get subscriptions' })
  async getAllSubscriptions(
    @Query() findSubscriptionDto: FindSubscriptionDto,
  ): Promise<PaginationResponseDto<Subscription>> {
    this.logger.log(
      `Attempting to find subscriptions: ${JSON.stringify(findSubscriptionDto)}`,
    );
    return this.subscriptionsService.find(findSubscriptionDto);
  }
}
