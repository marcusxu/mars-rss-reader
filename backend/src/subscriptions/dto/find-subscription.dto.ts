import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSubscriptionDto } from './base-subscription.dto';
import { PaginationRequestDto } from 'src/common/pagination/pagination-request.dto';

export class FindSubscriptionDto
  extends PaginationRequestDto
  implements Partial<BaseSubscriptionDto>
{
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Subscription ID',
  })
  id?: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Valid RSS feed URL',
  })
  url?: string;

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
