import { ApiProperty } from '@nestjs/swagger';

export class DeleteSubscriptionResponseDto {
  @ApiProperty({ description: 'Subscription ID' })
  id: string;

  @ApiProperty({ description: 'Operation message' })
  message: string;
}
