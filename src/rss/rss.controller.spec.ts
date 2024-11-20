import { Test, TestingModule } from '@nestjs/testing';
import { RssController } from './rss.controller';
import { RssService } from './rss.service';
import { Logger, InternalServerErrorException } from '@nestjs/common';

describe('RssController', () => {
  let rssController: RssController;
  let rssService: RssService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RssController],
      providers: [
        RssService
      ],
    }).compile();

    rssController = module.get<RssController>(RssController);
    rssService = module.get<RssService>(RssService);
  });

  it('should be defined', () => {
    expect(rssController).toBeDefined();
  });

  describe('getFeed', () => {
    const mockFeedResult = {
      title: 'Mock RSS Feed',
      description: 'This is a mock RSS feed for testing',
      link: 'https://example.com',
      items: [
        {
          title: 'Mock Item 1',
          link: 'https://example.com/item1',
          pubDate: new Date().toISOString(),
          content: 'This is mock content for item 1',
        },
      ],
    };

    it('Successfully fetch feed', async () => {
      jest.spyOn(rssService, 'getFeed').mockResolvedValue(mockFeedResult);
      
      const result = await rssController.getFeed('https://example.com');
      
      expect(result).toEqual(mockFeedResult);
    });

    it('Failed to fetch feed', async () => {
      const errorMessage = 'Failed to fetch RSS feed';
      jest.spyOn(rssService, 'getFeed').mockRejectedValue(new Error(errorMessage));
      
      await expect(rssController.getFeed('https://example.com/invalid')).rejects.toThrow(InternalServerErrorException);
    });

    it('Check feed structure', async () => {
      jest.spyOn(rssService, 'getFeed').mockResolvedValue(mockFeedResult);
      
      const result = await rssController.getFeed('https://example.com');
      
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('link');
      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);
      
      if (result.items.length > 0) {
        const firstItem = result.items[0];
        expect(firstItem).toHaveProperty('title');
        expect(firstItem).toHaveProperty('link');
        expect(firstItem).toHaveProperty('pubDate');
        expect(firstItem).toHaveProperty('content');
      }
    });
  });
});
