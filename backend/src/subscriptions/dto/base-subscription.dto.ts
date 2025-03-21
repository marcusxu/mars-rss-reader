import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, IsString, IsOptional } from 'class-validator';

export class BaseSubscriptionDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'Valid RSS feed URL',
  })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the subscription',
  })
  name: string;

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
