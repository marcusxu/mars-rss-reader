import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ArticleResponseDto {
  @ApiProperty({
    description: 'Article ID',
  })
  @IsString()
  articleId: string;

  @ApiProperty({ description: 'Updated Date' })
  @IsString()
  updatedAt: string;
}
