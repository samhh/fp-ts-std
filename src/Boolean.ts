/**
 * @since 0.1.0
 */

import { Endomorphism } from 'fp-ts/function';

/**
 * Invert a boolean.
 *
 * @since 0.4.0
 */
export const invert: Endomorphism<boolean> = x => !x;

/**
 * Returns `true` if both arguments are `true`, else `false`. Equivalent to
 * logical conjunction.
 *
 * @since 0.4.0
 */
export const and = (x: boolean): Endomorphism<boolean> => y => x && y;

/**
 * Returns `true` if one or both arguments are `true`, else `false`. Equivalent
 * to logical disjunction.
 *
 * @since 0.4.0
 */
export const or = (x: boolean): Endomorphism<boolean> => y => x || y;

/**
 * Returns `true` if one argument is `true` and the other is `false`, else
 * `false`. Equivalent to exclusive logical disjunction.
 *
 * @since 0.4.0
 */
export const xor = (x: boolean): Endomorphism<boolean> => y => (x && !y) || (!x && y);

