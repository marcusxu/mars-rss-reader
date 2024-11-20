import { Controller, Get, Query, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RssService } from './rss.service';
import { RssFeedDto } from './rss.dto';

@ApiTags('rss')
@Controller('rss')
export class RssController {
    private readonly logger = new Logger(RssController.name);

  constructor(private readonly rssService: RssService) {}

  @Get()
  @ApiOperation({ summary: 'Get RSS feed' })
  @ApiQuery({ name: 'url', required: true, description: 'URL of the RSS feed' })
  @ApiResponse({ status: 200, description: 'The RSS feed', type: RssFeedDto  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
    async getFeed(@Query('url') url: string) {
    this.logger.log(`Attempting to fetch feed from: ${url}`);
    try {
        const result = await this.rssService.getFeed(url);
        this.logger.log(`Successfully fetched feed from: ${url}`);
        return result;
    } catch (error) {
        this.logger.error(`Error fetching feed: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Failed to fetch RSS feed');
    }
  }
}
