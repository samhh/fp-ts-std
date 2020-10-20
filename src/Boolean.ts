/**
 * @since 0.1.0
 */

import { Predicate } from 'fp-ts/function';

/**
 * Invert a predicate.
 *
 * @example
 * import { complement } from 'fp-ts-std/Boolean';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isFive: Predicate<number> = x => x === 5;
 * const isNotFive = complement(isFive);
 *
 * assert.strictEqual(isFive(5), true);
 * assert.strictEqual(isNotFive(5), false);
 *
 * @since 0.4.0
 */
export const complement = <A>(f: Predicate<A>): Predicate<A> => x => !f(x);

