import { PaginationRequestDto } from 'src/common/pagination/pagination-request.dto';
import { BaseArticleDto } from './base-article.dto';
import {
  IsString,
  IsUrl,
  IsOptional,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindArticleDto
  extends PaginationRequestDto
  implements Partial<BaseArticleDto>
{
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Article ID',
  })
  id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Article title',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Article content',
  })
  content?: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Article link',
  })
  link?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Article author',
  })
  author?: string;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Article published date',
  })
  pubDate?: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Feed subscription Id',
  })
  subscriptionId?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiPropertyOptional({
    description: 'Is read',
  })
  isRead?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @ApiPropertyOptional({
    description: 'Is favorite',
  })
  isFavorite?: boolean;
}
