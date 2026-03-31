import { BadRequestException } from '@nestjs/common';

export class ValidationUtil {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  static validateUUID(value: string, fieldName: string): void {
    if (value && !this.UUID_REGEX.test(value)) {
      throw new BadRequestException(`Invalid UUID format for ${fieldName}`);
    }
  }

  static validateUUIDs(values: string[], fieldName: string): void {
    if (!values || !Array.isArray(values)) {
      return;
    }

    const invalidUUIDs = values.filter(
      (value) => typeof value === 'string' && !this.UUID_REGEX.test(value),
    );

    if (invalidUUIDs.length > 0) {
      throw new BadRequestException(
        `Invalid UUID format in ${fieldName}: ${invalidUUIDs.join(', ')}`,
      );
    }
  }

  static isValidUUID(value: string): boolean {
    return typeof value === 'string' && this.UUID_REGEX.test(value);
  }
}
