import { ApiProperty } from '@nestjs/swagger';

export class RssItemDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  pubDate: string;

  @ApiProperty()
  content: string;
}

export class RssFeedDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  link: string;

  @ApiProperty({ type: [RssItemDto] })
  items: RssItemDto[];
}
