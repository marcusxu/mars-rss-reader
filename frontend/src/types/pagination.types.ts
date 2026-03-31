export interface PaginationRequest {
  page?: number;
  perPage?: number;
}

export interface PaginationResponse<T> {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T[];
}
