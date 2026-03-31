import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpExceptionFilter } from 'src/common/exception_filters/http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(async () => {
    filter = new HttpExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/test-url',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException', () => {
    const httpException = new HttpException(
      'Test error',
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(httpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Test error',
    });
  });

  it('should handle generic Error', () => {
    const genericError = new Error('Generic error message');

    filter.catch(genericError, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Generic error message',
    });
  });

  it('should handle unknown exception', () => {
    const unknownException = { some: 'unknown error' };

    filter.catch(unknownException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Internal server error',
    });
  });

  it('should include correct timestamp format', () => {
    const httpException = new HttpException(
      'Test error',
      HttpStatus.BAD_REQUEST,
    );
    const beforeCall = new Date().toISOString();

    filter.catch(httpException, mockArgumentsHost);

    const callArgs = mockResponse.json.mock.calls[0][0];
    const timestamp = callArgs.timestamp;

    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(new Date(timestamp).getTime()).toBeGreaterThanOrEqual(
      new Date(beforeCall).getTime(),
    );
  });
});
