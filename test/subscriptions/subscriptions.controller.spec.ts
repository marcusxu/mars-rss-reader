import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from '../../src/subscriptions/subscriptions.controller';
import { SubscriptionsService } from '../../src/subscriptions/subscriptions.service';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BaseSubscriptionDto } from '../../src/subscriptions/dto/base-subscription.dto';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let service: SubscriptionsService;
  const mockSubscriptionsService = {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSubscription', () => {
    const testCases = [
      {
        name: 'Successfully created',
        input: {
          url: 'http://test.com',
          name: 'Test Subscription',
          description: 'Test Description',
          category: 'Test Category',
        },
        mockReturn: {
          id: 1,
          url: 'http://test.com',
          name: 'Test Subscription',
          description: 'Test Description',
          category: 'Test Category',
        },
        expectedResult: {
          id: 1,
          url: 'http://test.com',
          name: 'Test Subscription',
          description: 'Test Description',
          category: 'Test Category',
        },
        expectError: false,
      },
      {
        name: 'Duplicate subscription',
        input: {
          url: 'http://duplicate.com',
          name: 'Duplicate Subscription',
          description: 'Duplicate Description',
          category: 'Duplicate Category',
        },
        mockReturn: new ConflictException('Duplicate subscription'),
        expectedResult: {
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'Duplicate subscription',
        },
        expectError: true,
      },
    ];

    test.each(testCases)(
      '$name',
      async ({ input, mockReturn, expectedResult, expectError }) => {
        expectError
          ? mockSubscriptionsService.create.mockRejectedValue(mockReturn)
          : mockSubscriptionsService.create.mockResolvedValue(mockReturn);

        if (expectError) {
          try {
            await controller.createSubscription(input as BaseSubscriptionDto);
          } catch (e) {
            expect(e).toBeInstanceOf(HttpException);
            expect(e.getStatus()).toEqual(HttpStatus.CONFLICT);
            expect(e.getResponse()).toEqual(expectedResult);
          }
        } else {
          const result = await controller.createSubscription(
            input as BaseSubscriptionDto,
          );
          expect(result).toEqual(expectedResult);
        }
      },
    );
  });
  describe('deleteSubscription', () => {
    const testCases = [
      {
        name: 'Successfully deleted',
        input: '1',
        mockReturn: undefined,
        expectedResult: undefined,
        expectError: false,
      },
      {
        name: 'Subscription not found',
        input: '2',
        mockReturn: new NotFoundException('Subscription not found'),
        expectedResult: {
          status: HttpStatus.NOT_FOUND,
          error: 'Subscription not found',
          message: 'Subscription not found',
        },
        expectError: true,
      },
    ];
    test.each(testCases)(
      '$name',
      async ({ input, mockReturn, expectedResult, expectError }) => {
        expectError
          ? mockSubscriptionsService.remove.mockRejectedValue(mockReturn)
          : mockSubscriptionsService.remove.mockResolvedValue(mockReturn);

        if (expectError) {
          try {
            await controller.deleteSubscription(input);
          } catch (e) {
            if (e instanceof HttpException) {
              expect(e).toBeInstanceOf(HttpException);
              expect(e.getStatus()).toEqual(expectedResult.status);
              expect(e.getResponse()).toEqual(expectedResult);
            } else {
              expect(e).toEqual(expectedResult);
            }
          }
        } else {
          const result = await controller.deleteSubscription(input);
          expect(result).toEqual(expectedResult);
        }
      },
    );
  });
  describe('updateSubscription', () => {
    const testCases = [
      {
        name: 'Successfully updated',
        input: {
          id: '1',
          dto: {
            name: 'Updated Subscription',
            url: 'http://updated.com',
            description: 'Updated Description',
            category: 'Updated Category',
          },
        },
        mockReturn: {
          id: 1,
          name: 'Updated Subscription',
          url: 'http://updated.com',
          description: 'Updated Description',
          category: 'Updated Category',
        },
        expectedResult: {
          id: 1,
          name: 'Updated Subscription',
          url: 'http://updated.com',
          description: 'Updated Description',
          category: 'Updated Category',
        },
        expectError: false,
      },
      {
        name: 'Subscription not found',
        input: {
          id: '2',
          dto: {
            name: 'Non-existent Subscription',
            url: 'http://non-existent.com',
            description: 'Non-existent Description',
            category: 'Non-existent Category',
          },
        },
        mockReturn: new NotFoundException('Subscription not found'),
        expectedResult: {
          status: HttpStatus.NOT_FOUND,
          error: 'Subscription not found',
          message: 'Subscription not found',
        },
        expectError: true,
      },
    ];
    test.each(testCases)(
      '$name',
      async ({ input, mockReturn, expectedResult, expectError }) => {
        expectError
          ? mockSubscriptionsService.update.mockRejectedValue(mockReturn)
          : mockSubscriptionsService.update.mockResolvedValue(mockReturn);

        if (expectError) {
          try {
            await controller.updateSubscription(
              input.id,
              input.dto as BaseSubscriptionDto,
            );
          } catch (e) {
            if (e instanceof HttpException) {
              expect(e).toBeInstanceOf(HttpException);
              expect(e.getStatus()).toEqual(expectedResult.status);
              expect(e.getResponse()).toEqual(expectedResult);
            } else {
              expect(e).toEqual(expectedResult);
            }
          }
        } else {
          const result = await controller.updateSubscription(
            input.id,
            input.dto as BaseSubscriptionDto,
          );
          expect(result).toEqual(expectedResult);
        }
      },
    );
  });
  describe('getSubscriptions', () => {
    const testCases = [
      {
        name: 'Successfully get all subscriptions',
        input: {},
        mockReturn: [
          { id: '1', url: 'url1', name: 'name1', category: 'category1' },
        ],
        expectedResult: [
          {
            id: '1',
            url: 'url1',
            name: 'name1',
            category: 'category1',
          },
        ],
        expectError: false,
      },
      {
        name: 'Successfully get subscriptions with query parameters',
        input: { id: '1', url: 'url1', name: 'name1', category: 'category1' },
        mockReturn: {
          id: '1',
          url: 'url1',
          name: 'name1',
          category: 'category1',
        },

        expectedResult: {
          id: '1',
          url: 'url1',
          name: 'name1',
          category: 'category1',
        },

        expectError: false,
      },
      {
        name: 'No subscriptions found',
        input: { id: '2', url: 'url2', name: 'name2', category: 'category2' },
        mockReturn: new NotFoundException(
          'No subscriptions found matching the criteria',
        ),
        expectedResult: {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'No subscriptions found matching the criteria',
        },
        expectError: true,
      },
    ];
    test.each(testCases)(
      '$name',
      async ({ input, mockReturn, expectedResult, expectError }) => {
        expectError
          ? mockSubscriptionsService.find.mockRejectedValue(mockReturn)
          : mockSubscriptionsService.find.mockResolvedValue(mockReturn);

        if (expectError) {
          try {
            await controller.getAllSubscriptions(
              input.id,
              input.url,
              input.name,
              input.category,
            );
          } catch (e) {
            if (e instanceof HttpException) {
              expect(e).toBeInstanceOf(HttpException);
              if ('status' in expectedResult) {
                expect(e.getStatus()).toEqual(expectedResult.status);
              }
              expect(e.getResponse()).toEqual(expectedResult);
            } else {
              expect(e).toEqual(expectedResult);
            }
          }
        } else {
          const result = await controller.getAllSubscriptions(
            input.id,
            input.url,
            input.name,
            input.category,
          );
          expect(result).toEqual(expectedResult);
        }
      },
    );
  });
});
