import { ApiError, ServiceResult } from '../types';

export function handleApiError<T>(error: unknown): ServiceResult<T> {
  if (isApiError(error)) {
    return {
      success: false,
      error,
    };
  }

  const unknownError: ApiError = {
    statusCode: 500,
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    path: '',
  };

  return {
    success: false,
    error: unknownError,
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
