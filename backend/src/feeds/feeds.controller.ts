import { Controller, Logger, Param, Patch, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FeedsService } from './feeds.service';
import { FeedResponseDto } from './dto/feed-response.dto';
import { ValidationUtil } from 'src/common/utils/validation.util';

@ApiTags('feeds')
@Controller('feeds')
export class FeedsController {
  private readonly logger = new Logger(FeedsController.name);

  constructor(private readonly feedsService: FeedsService) {}

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update articles for a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  async updateFeedForSub(@Param('id') id: string): Promise<FeedResponseDto> {
    if (!ValidationUtil.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID format for subscription id');
    }

    this.logger.log(`Attempting to update articles for subscription: ${id}`);
    return await this.feedsService.update(id);
  }

  @Patch('cleanup/:id')
  @ApiOperation({ summary: 'Cleanup articles for a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  async cleanupFeedForSub(@Param('id') id: string): Promise<FeedResponseDto> {
    if (!ValidationUtil.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID format for subscription id');
    }

    this.logger.log(`Attempting to cleanup articles for subscription: ${id}`);
    return await this.feedsService.cleanupArticles(id);
  }

  @Patch('update-all')
  @ApiOperation({ summary: 'Update articles for all subscriptions' })
  async updateFeedForAll(): Promise<FeedResponseDto> {
    this.logger.log('Attempting to update articles for all subscriptions');
    return await this.feedsService.updateAll();
  }

  @Patch('cleanup-all')
  @ApiOperation({ summary: 'Cleanup articles for all subscriptions' })
  async cleanupFeedForAll(): Promise<FeedResponseDto> {
    this.logger.log('Attempting to cleanup articles for all subscriptions');
    return await this.feedsService.cleanupAll();
  }
}
