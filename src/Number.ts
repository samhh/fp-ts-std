/**
 * @since 0.1.0
 */

import {Endomorphism} from 'fp-ts/lib/function';

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
export const add = (x: number) => (y: number): number => x + y;

