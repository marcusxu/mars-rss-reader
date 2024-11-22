import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from '../../src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from '../../src/subscriptions/subscriptions.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const testCases = [
      {
        name: 'Invalid URL: Bad requests',
        input: { url: '', name: 'test' },
        existingSubscription: null,
        expectedError: new BadRequestException('Invalid subscription data'),
      },
      {
        name: 'Duplicate URL: Conflict',
        input: { url: 'http://test.com', name: 'test' },
        existingSubscription: { id: '1', url: 'http://test.com', name: 'test' },
        expectedError: new ConflictException(
          `Subscription with URL already exists: http://test.com`,
        ),
      },
      {
        name: 'Valid Subscription: Success',
        input: { url: 'http://test.com', name: 'test' },
        existingSubscription: null,
        expectedOutput: { url: 'http://test.com', name: 'test' },
      },
    ];
    test.each(testCases)(
      '$name',
      async ({
        input,
        existingSubscription,
        expectedError,
        expectedOutput,
      }) => {
        mockRepository.findOne.mockResolvedValue(existingSubscription);
        mockRepository.create.mockReturnValue(input);
        mockRepository.save.mockResolvedValue(expectedOutput);

        if (expectedError) {
          await expect(service.create(input)).rejects.toThrow(expectedError);
        } else {
          const result = await service.create(input);
          expect(result).toEqual(expectedOutput);
        }
      },
    );
  });
  describe('delete', () => {
    const testData = [
      {
        name: 'Subscription not exist: NotFoundException',
        id: '1',
        existingSubscription: null,
        expectedError: new NotFoundException('Subscription not found: 1'),
      },
      {
        name: 'Subscription exist: Success',
        id: '1',
        existingSubscription: { id: '1', url: 'http://test.com', name: 'test' },
        expectedOutput: undefined,
      },
    ];

    testData.forEach(
      ({ name, id, existingSubscription, expectedError, expectedOutput }) => {
        it(name, async () => {
          mockRepository.findOne.mockResolvedValue(existingSubscription);
          mockRepository.delete.mockResolvedValue({
            affected: existingSubscription ? 1 : 0,
          });

          if (expectedError) {
            await expect(service.remove(id)).rejects.toThrow(expectedError);
          } else {
            const result = await service.remove(id);
            expect(result).toEqual(expectedOutput);
          }
        });
      },
    );
  });

  describe('update', () => {
    const testData = [
      {
        name: 'Subscription not exist: NotFoundException',
        id: '1',
        input: { url: 'http://test.com', name: 'Test' },
        existingSubscription: null,
        expectedError: new NotFoundException('Subscription not found: 1'),
      },
      {
        name: 'Subscription exist: Success',
        id: '1',
        input: { url: 'http://test.com', name: 'Test' },
        existingSubscription: {
          id: '1',
          url: 'http://old.com',
          name: 'Old',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        expectedOutput: {
          id: '1',
          url: 'http://test.com',
          name: 'Test',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      },
    ];

    testData.forEach(
      ({
        name,
        id,
        input,
        existingSubscription,
        expectedError,
        expectedOutput,
      }) => {
        it(name, async () => {
          mockRepository.findOne.mockResolvedValue(existingSubscription);
          if (existingSubscription) {
            mockRepository.save.mockResolvedValue({
              ...existingSubscription,
              ...input,
              updatedAt: new Date(),
            });
          }

          if (expectedError) {
            await expect(service.update(id, input)).rejects.toThrow(
              expectedError,
            );
          } else {
            const result = await service.update(id, input);
            expect(result).toEqual(expectedOutput);
          }
        });
      },
    );
  });
  describe('find', () => {
    const testCases = [
      {
        name: 'No result found: NotFoundException',
        input: { url: 'http://test.com' },
        output: new NotFoundException(
          'No subscriptions found matching the criteria',
        ),
        mockReturnValue: [],
      },
      {
        name: 'Found successfully',
        input: { url: 'http://test.com' },
        output: [{ id: '1', url: 'http://test.com' }],
        mockReturnValue: [{ id: '1', url: 'http://test.com' }],
      },
    ];

    testCases.forEach((tc) => {
      it(tc.name, async () => {
        mockRepository.find.mockReturnValue(
          Promise.resolve(tc.mockReturnValue),
        );
        try {
          const result = await service.find(tc.input);
          expect(result).toEqual(tc.output);
        } catch (error) {
          expect(error).toEqual(tc.output);
        }
      });
    });
  });
});
