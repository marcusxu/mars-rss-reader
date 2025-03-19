import { Controller, Logger, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedsService } from './feeds.service';
import { FeedResponseDto } from './dto/feed-response.dto';

@ApiTags('feeds')
@Controller('feeds')
export class FeedsController {
  private readonly logger = new Logger(FeedsController.name);

  constructor(private readonly feedsService: FeedsService) {}

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update articles for a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  async updateFeedForSub(@Param('id') id: string): Promise<FeedResponseDto> {
    this.logger.log(`Attempting to update articles for subscription: ${id}`);
    return await this.feedsService.update(id);
  }

  @Patch('cleanup/:id')
  @ApiOperation({ summary: 'Cleanup articles for a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  async cleanupFeedForSub(@Param('id') id: string): Promise<FeedResponseDto> {
    this.logger.log(`Attempting to delete subscription: ${id}`);
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
    this.logger.log(`Attempting to delete subscription for all subscriptions`);
    return await this.feedsService.cleanupAll();
  }
}
