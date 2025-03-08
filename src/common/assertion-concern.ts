import { isIP } from 'class-validator';

import { IllegalArgumentException } from './exceptions/illegal-argument-exception';
import { IllegalStateException } from './exceptions/illegal-state-exception';

/**
 * A base class for objects that assert their internal
 * state is consistent with their current state.
 */
export abstract class AssertionConcern {
  /**
   * Checks that the given boolean value is false.
   *
   * @param {boolean} aBoolean - The boolean value to check.
   * @param {string} errorMessage - The error message to throw if the assertion fails.
   * @throws {IllegalArgumentException} If the boolean value is true.
   */
  static assertArgumentFalse(aBoolean: boolean, errorMessage: string): void {
    if (aBoolean) throw new IllegalArgumentException(errorMessage);
  }

  /**
   * Checks that the length of the given string is within the specified range.
   *
   * @param {string} aString - The string to check.
   * @param {number} aMaximum - The maximum length of the string.
   * @param {string} errorMessage - The error message to throw if the assertion fails.
   * @throws {IllegalArgumentException} If the length of the string is not within the specified range.
   */
  static assertArgumentLength(
    aString: string,
    aMaximum: number,
    errorMessage: string,
  ): void;
  static assertArgumentLength(
    aString: string,
    aMinimum: number,
    aMaximum: number,
    errorMessage: string,
  ): void;
  /**
   * Checks that the length of the given string is within the specified range.
   *
   * @param {string} aString - The string to check.
   * @param {number} aMinimum - The minimum length of the string.
   * @param {number|string} errorMessageOrMaximum - The maximum length of the string, or the error message if the string is too long.
   * @param {string} [errorMessage] - The error message to throw if the assertion fails.
   * @throws {IllegalArgumentException} If the length of the string is not within the specified range.
   */
  static assertArgumentLength(
    aString: string,
    aMinimum: number,
    errorMessageOrMaximum: unknown,
    errorMessage?: string,
  ): void {
    const length: number = aString.trim().length;

    const aMaximum = errorMessage
      ? (errorMessageOrMaximum as number)
      : aMinimum;
    aMinimum = errorMessage ? aMinimum : 0;
    errorMessage = errorMessage ?? (errorMessageOrMaximum as string);

    if (length < aMinimum || length > aMaximum) {
      throw new IllegalArgumentException(errorMessage);
    }
  }

  /**
   * Checks that the given string is not empty.
   *
   * @param {string} aString - The string to check.
   * @param {string} errorMessage - The error message to throw if the assertion fails.
   * @throws {IllegalArgumentException} If the string is empty.
   */
  static assertArgumentNotEmpty(aString: string, errorMessage: string): void {
    if (aString == null || aString.trim().length == 0) {
      throw new IllegalArgumentException(errorMessage);
    }
  }

  /**
   * Checks that the given value is not null.
   *
   * @param {unknown} unk - The value to check.
   * @param {string} errorMessage - The error message to throw if the assertion fails.
   * @throws {IllegalArgumentException} If the value is null.
   */
  static assertArgumentNotNull(unk: unknown, errorMessage: string): void {
    if (unk == null) {
      throw new IllegalArgumentException(errorMessage);
    }
  }

  /**
   * Checks that the given value is within the specified range.
   *
   * @param {number} aValue - The value to check.
   * @param {number} aMinimum - The minimum value.
   * @param {number} aMaximum - The maximum value.
   * @param {string} errorMessage - The error message to throw if the assertion fails.
   * @throws {IllegalArgumentException} If the value is not within the specified range.
   */
  static assertArgumentRange(
    aValue: number,
    aMinimum: number,
    aMaximum: number,
    errorMessage: string,
  ): void {
    if (aValue < aMinimum || aValue > aMaximum) {
      throw new IllegalArgumentException(errorMessage);
    }
  }

  /**
   * Checks that the given boolean value is true.
   *
   * @param {boolean} aBoolean - The boolean value to check.
   * @param {string} errorMessage - The error message to throw if the assertion fails.
   * @throws {IllegalArgumentException} If the boolean value is false.
   */
  static assertArgumentTrue(aBoolean: boolean, errorMessage: string): void {
    if (!aBoolean) {
      throw new IllegalArgumentException(errorMessage);
    }
  }

  /**
   * Checks that the given boolean value is false.
   *
   * @param {boolean} aBoolean - The boolean value to check.
   * @param {string} errorMessage - The error message to throw if the assertion fails.
   * @throws {IllegalStateException} If the boolean value is true.
   */
  static assertStateFalse(aBoolean: boolean, errorMessage: string): void {
    if (aBoolean) {
      throw new IllegalStateException(errorMessage);
    }
  }

  /**
   * Checks that the given boolean value is true.
   *
   * @param {boolean} aBoolean - The boolean value to check.
   * @param {string} errorMessage - The error message to throw if the assertion fails.
   * @throws {IllegalStateException} If the boolean value is false.
   */
  static assertStateTrue(aBoolean: boolean, errorMessage: string): void {
    if (!aBoolean) {
      throw new IllegalStateException(errorMessage);
    }
  }

  /**
   * Checks that the given string is a valid IP address.
   *
   * @param {string} value - The string to check.
   * @throws {IllegalArgumentException} If the string is not a valid IP address.
   */
  static assertArgumentIpAddress(value: string) {
    this.assertArgumentTrue(isIP(value), 'Invalid IP address');
  }
}
