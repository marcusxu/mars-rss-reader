export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
