import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Parser from 'rss-parser';

@Injectable()
export class RssService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async getFeed(url: string) {
    try {
      const response = await axios.get(url);
      const feed = await this.parser.parseString(response.data);
      return feed;
    } catch (error) {
      throw new Error(`Failed to fetch RSS feed: ${error.message}`);
    }
  }
}
