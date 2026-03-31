import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsString } from 'class-validator';

export class BatchUpdateResponseDto {
  @ApiProperty({
    description: 'Number of successfully updated articles',
    example: 10,
  })
  @IsNumber()
  updatedCount: number;

  @ApiProperty({
    description: 'Array of article IDs that failed to update',
    example: ['uuid-1', 'uuid-2'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  failedIds: string[];

  @ApiProperty({
    description: 'Summary message of the batch update operation',
    example: 'Updated 10 articles, 2 failed',
  })
  @IsString()
  message: string;
}
