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
import { IsCustomUUID } from 'src/common/decorators/is-uuid.decorator';

export class FindArticleDto
  extends PaginationRequestDto
  implements Partial<BaseArticleDto>
{
  @IsCustomUUID({ message: 'Article ID must be a valid UUID' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Article ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
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

  @IsCustomUUID({ message: 'Subscription ID must be a valid UUID' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Feed subscription Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
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
