// src/articles/dto/create-article.dto.ts

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
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsNotEmpty()
  @IsDate()
  pubDate: Date;

  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
