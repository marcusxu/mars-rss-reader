import { ApiProperty } from '@nestjs/swagger';
import { BaseSubscriptionDto } from './base-subscription.dto';
import { IsString } from 'class-validator';

export class SubscriptionResponseDto extends BaseSubscriptionDto {
  @ApiProperty({
    description: 'Subscription ID',
  })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Created Date', required: false })
  @IsString()
  createdAt: string;

  @ApiProperty({ description: 'Updated Date', required: false })
  @IsString()
  updatedAt: string;
}
