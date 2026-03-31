import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FeedResponseDto {
  @ApiPropertyOptional({
    description: 'Subscription ID (null for batch operations)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  subscriptionId?: string;

  @ApiProperty({
    description: 'Operation completion timestamp',
    example: 'Thu Dec 05 2024',
  })
  @IsString()
  updatedAt: string;

  @ApiProperty({
    description: 'Number of articles processed (updated/deleted)',
    example: 15,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  articlesCount: number;
}
