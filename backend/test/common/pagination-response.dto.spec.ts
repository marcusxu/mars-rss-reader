import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';

describe('PaginationResponseDto', () => {
  it('should create pagination response with correct properties', () => {
    const page = 2;
    const perPage = 10;
    const total = 25;
    const data = ['item1', 'item2', 'item3'];

    const paginationResponse = new PaginationResponseDto(
      page,
      perPage,
      total,
      data,
    );

    expect(paginationResponse.page).toBe(2);
    expect(paginationResponse.perPage).toBe(10);
    expect(paginationResponse.total).toBe(25);
    expect(paginationResponse.data).toEqual(['item1', 'item2', 'item3']);
    expect(paginationResponse.totalPages).toBe(3); // Math.ceil(25 / 10)
  });

  it('should calculate totalPages correctly with exact division', () => {
    const paginationResponse = new PaginationResponseDto(1, 10, 20, []);

    expect(paginationResponse.totalPages).toBe(2); // 20 / 10 = 2
  });

  it('should calculate totalPages correctly with remainder', () => {
    const paginationResponse = new PaginationResponseDto(1, 10, 23, []);

    expect(paginationResponse.totalPages).toBe(3); // Math.ceil(23 / 10) = 3
  });

  it('should handle zero total items', () => {
    const paginationResponse = new PaginationResponseDto(1, 10, 0, []);

    expect(paginationResponse.totalPages).toBe(0); // Math.ceil(0 / 10) = 0
  });

  it('should handle single page scenario', () => {
    const paginationResponse = new PaginationResponseDto(1, 10, 5, []);

    expect(paginationResponse.totalPages).toBe(1); // Math.ceil(5 / 10) = 1
  });

  it('should work with generic type', () => {
    interface TestItem {
      id: number;
      name: string;
    }

    const items: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    const paginationResponse = new PaginationResponseDto<TestItem>(
      1,
      10,
      2,
      items,
    );

    expect(paginationResponse.data).toHaveLength(2);
    expect(paginationResponse.data[0]).toEqual({ id: 1, name: 'Item 1' });
    expect(paginationResponse.data[1]).toEqual({ id: 2, name: 'Item 2' });
  });
});
