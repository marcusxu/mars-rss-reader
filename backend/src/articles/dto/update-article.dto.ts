import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateArticleDto {
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

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ids for bulk operation',
    type: [String],
  })
  ids?: string[];
}
