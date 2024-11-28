// src/articles/dto/create-article.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class BaseArticleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Article title',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Article content',
  })
  content: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'Article link',
  })
  link: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Article author',
  })
  author?: string;

  @IsNotEmpty()
  @IsDate()
  @ApiPropertyOptional({
    description: 'Article published date',
  })
  pubDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Feed subscription Id',
  })
  subscriptionId: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Is read',
  })
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Is favorite',
  })
  isFavorite?: boolean;
}
