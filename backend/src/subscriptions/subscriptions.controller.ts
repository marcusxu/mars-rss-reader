import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseSubscriptionDto } from './dto/base-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a subscription' })
  async createSubscription(
    @Body() createSubscriptionDto: BaseSubscriptionDto,
  ): Promise<Subscription> {
    this.logger.log(`Attempting to create a new subscription`);
    try {
      return this.subscriptionsService.create(createSubscriptionDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Duplicate subscription',
            message: error.message,
          },
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a subscription by ID' })
  async deleteSubscription(@Param('id') id: string): Promise<void> {
    this.logger.log(`Attempting to remove subscription: ${id}`);
    try {
      await this.subscriptionsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Subscription not found',
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modify a subscription by ID' })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: BaseSubscriptionDto,
  ): Promise<Subscription> {
    this.logger.log(`Attempting to remove subscription: ${id}`);
    try {
      return await this.subscriptionsService.update(id, updateSubscriptionDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Subscription not found',
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get subscriptions' })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'url', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'category', required: false })
  async getAllSubscriptions(
    @Query('id') id?: string,
    @Query('url') url?: string,
    @Query('name') name?: string,
    @Query('category') category?: string,
  ): Promise<Subscription[]> {
    if (id || url || name || category) {
      this.logger.log(
        `Attempting to find subscriptions with params: id=${id}, url=${url}, name=${name}, category=${category}`,
      );
      return this.subscriptionsService.find({
        id,
        url,
        name,
        category,
      });
    } else {
      this.logger.log(`Attempting to find all subscriptions`);
      return this.subscriptionsService.find({});
    }
  }
}
