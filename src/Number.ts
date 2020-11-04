/**
 * @since 0.1.0
 */

import { Endomorphism } from 'fp-ts/function';

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
export const increment: Endomorphism<number> = x => x + 1;

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
export const decrement: Endomorphism<number> = x => x - 1;

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
export const add = (x: number): Endomorphism<number> => y => x + y;

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
export const multiply = (x: number): Endomorphism<number> => y => x * y;

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
    minuend - subtrahend;

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
    dividend / divisor;

