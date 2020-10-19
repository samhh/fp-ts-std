/**
 * @since 0.1.0
 */

import { Endomorphism } from 'fp-ts/function';

/**
 * Increment a number.
 *
 * @since 0.1.0
 */
export const increment: Endomorphism<number> = x => x + 1;

/**
 * Decrement a number.
 *
 * @since 0.1.0
 */
export const decrement: Endomorphism<number> = x => x - 1;

/**
 * Add two numbers together.
 *
 * @since 0.1.0
 */
export const add = (x: number): Endomorphism<number> => y => x + y;

/**
 * Multiply two numbers together.
 *
 * @since 0.2.0
 */
export const multiply = (x: number): Endomorphism<number> => y => x * y;

/**
 * Subtract the first number (the _subtrahend_) from the second number (the
 * _minuend_).
 *
 * @since 0.2.0
 */
export const subtract = (subtrahend: number): Endomorphism<number> => minuend =>
    minuend - subtrahend;

/**
 * Divide the second number (the _dividend_) by the first number (the
 * _divisor_).
 *
 * @since 0.2.0
 */
export const divide = (divisor: number): Endomorphism<number> => dividend =>
    dividend / divisor;

