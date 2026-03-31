import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsCustomUUID } from 'src/common/decorators/is-uuid.decorator';

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
  @IsCustomUUID({ each: true, message: 'Each ID must be a valid UUID' })
  @ApiPropertyOptional({
    description: 'ids for bulk operation',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  ids?: string[];
}
