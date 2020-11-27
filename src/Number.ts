/**
 * @since 0.1.0
 */

import { Endomorphism, not, Predicate } from "fp-ts/function"

/**
 * Check if a number is actually valid. Specifically, all this function is
 * doing is checking whether or not the number is `NaN`.
 *
 * @example
 * import { isValid } from 'fp-ts-std/Number';
 *
 * const valid = 123;
 * const invalid = NaN;
 *
 * assert.strictEqual(isValid(valid), true);
 * assert.strictEqual(isValid(invalid), false);
 *
 * @since 0.7.0
 */
export const isValid: Predicate<number> = not(Number.isNaN)

/**
 * Increment a number.
 *
 * @example
 * import { increment } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(increment(3), 4);
 *
 * @since 0.1.0
 */
export const increment: Endomorphism<number> = x => x + 1

/**
 * Decrement a number.
 *
 * @example
 * import { decrement } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(decrement(3), 2);
 *
 * @since 0.1.0
 */
export const decrement: Endomorphism<number> = x => x - 1

/**
 * Add two numbers together.
 *
 * @example
 * import { add } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(add(2)(3), 5);
 *
 * @since 0.1.0
 */
export const add = (x: number): Endomorphism<number> => y => x + y

/**
 * Multiply two numbers together.
 *
 * @example
 * import { multiply } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(multiply(2)(3), 6);
 *
 * @since 0.2.0
 */
export const multiply = (x: number): Endomorphism<number> => y => x * y

/**
 * Subtract the first number (the _subtrahend_) from the second number (the
 * _minuend_).
 *
 * @example
 * import { subtract } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(subtract(2)(3), 1);
 * assert.strictEqual(subtract(3)(2), -1);
 *
 * @since 0.2.0
 */
export const subtract = (subtrahend: number): Endomorphism<number> => minuend =>
  minuend - subtrahend

/**
 * Divide the second number (the _dividend_) by the first number (the
 * _divisor_).
 *
 * @example
 * import { divide } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(divide(2)(4), 2);
 * assert.strictEqual(divide(4)(2), .5);
 *
 * @since 0.2.0
 */
export const divide = (divisor: number): Endomorphism<number> => dividend =>
  dividend / divisor

/**
 * Calculates the remainder. See also `mod`.
 *
 * @example
 * import { rem } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(rem(2)(5.5), 1.5);
 * assert.strictEqual(rem(-4)(2), 2);
 * assert.strictEqual(rem(5)(-12), -2);
 *
 * @since 0.7.0
 */
export const rem = (divisor: number): Endomorphism<number> => dividend =>
  dividend % divisor

/**
 * Calculate the modulus. See also `rem`.
 *
 * @example
 * import { mod } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(mod(2)(5.5), 1.5);
 * assert.strictEqual(mod(-4)(2), -2);
 * assert.strictEqual(mod(5)(-12), 3);
 *
 * @since 0.7.0
 */
export const mod = (divisor: number): Endomorphism<number> => dividend =>
  ((dividend % divisor) + divisor) % divisor

/**
 * Unary negation.
 *
 * @example
 * import { negate } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(negate(42), -42);
 * assert.strictEqual(negate(-42), 42);
 *
 * @since 0.7.0
 */
export const negate: Endomorphism<number> = n => -n
