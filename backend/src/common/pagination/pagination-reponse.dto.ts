import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'current page' })
  page: number;

  @ApiProperty({ description: 'records per page' })
  perPage: number;

  @ApiProperty({ description: 'total records number' })
  total: number;

  @ApiProperty({ description: 'total pages number' })
  totalPages: number;

  @ApiProperty({ description: 'records', isArray: true })
  data: T[];

  constructor(page: number, perPage: number, total: number, data: T[]) {
    this.page = page;
    this.perPage = perPage;
    this.total = total;
    this.data = data;
    this.totalPages = Math.ceil(total / perPage);
  }
}
