import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FeedResponseDto {
  @ApiPropertyOptional({
    description: 'Subscription ID',
  })
  @IsString()
  @IsOptional()
  subscriptionId?: string;

  @ApiProperty({ description: 'Updated Date' })
  @IsString()
  updatedAt: string;

  @ApiProperty({ description: 'Articles count' })
  @IsNumber()
  articlesCount: number;
}
