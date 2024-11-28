import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FeedResponseDto {
  @ApiProperty({
    description: 'Subscription ID',
  })
  @IsString()
  subscriptionId: string;

  @ApiProperty({ description: 'Updated Date' })
  @IsString()
  updatedAt: string;

  @ApiProperty({ description: 'Articles count' })
  @IsNumber()
  articlesCount: number;
}
