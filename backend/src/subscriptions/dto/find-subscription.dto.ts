import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSubscriptionDto } from './base-subscription.dto';
import { PaginationRequestDto } from 'src/common/pagination/pagination-request.dto';
import { IsCustomUUID } from 'src/common/decorators/is-uuid.decorator';

export class FindSubscriptionDto
  extends PaginationRequestDto
  implements Partial<BaseSubscriptionDto>
{
  @IsCustomUUID({ message: 'Subscription ID must be a valid UUID' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Subscription ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
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
