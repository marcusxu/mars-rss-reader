// src/subscriptions/dto/create-subscription.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, IsString } from 'class-validator';

export class BaseSubscriptionDto {
  @ApiProperty({ description: 'Subscription Url' })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Subscription Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category', required: false })
  @IsString()
  category?: string;
}
