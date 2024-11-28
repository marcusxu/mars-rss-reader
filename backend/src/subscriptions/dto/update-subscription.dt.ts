import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { BaseSubscriptionDto } from './base-subscription.dto';

export class UpdateSubscriptionDto implements Partial<BaseSubscriptionDto> {
  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Valid RSS feed URL',
  })
  ur?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Name of the subscription',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Description of the subscription',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Category for the subscription',
  })
  category?: string;
}
