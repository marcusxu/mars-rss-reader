import {
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Article } from 'src/articles/entities/article.entity';
import { FeedsService } from './feeds.service';

@ApiTags('feeds')
@Controller('feeds')
export class FeedsController {
  private readonly logger = new Logger(FeedsController.name);

  constructor(private readonly feedsService: FeedsService) {}

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update articles for a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({
    status: 200,
    description: 'Articles updated successfully',
    type: [Article],
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateSubscriptionArticles(
    @Param('id') id: string,
  ): Promise<Article[]> {
    this.logger.log(`Attempting to update articles for subscription: ${id}`);
    try {
      return await this.feedsService.update(id);
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
      this.logger.error(
        `Error updating articles for subscription ${id}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'An error occurred while updating articles',
      );
    }
  }

  @Patch('cleanup/:id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Articles deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async removeSubscription(@Param('id') id: string): Promise<void> {
    this.logger.log(`Attempting to delete subscription: ${id}`);
    try {
      await this.feedsService.cleanupArticles(id);
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
      this.logger.error(
        `Error deleting articles for subscription ${id}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'An error occurred while deleting articles',
      );
    }
  }
}
