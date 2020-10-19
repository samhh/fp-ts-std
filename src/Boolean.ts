/**
 * @since 0.1.0
 */

import { Predicate } from 'fp-ts/function';

/**
 * Invert a predicate.
 *
 * @example
 * import { not } from 'fp-ts-std/Boolean';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isFive: Predicate<number> = x => x === 5;
 * const isNotFive = not(isFive);
 *
 * assert.strictEqual(isFive(5), true);
 * assert.strictEqual(isNotFive(5), false);
 *
 * @since 0.1.0
 */
export const not = <A>(f: Predicate<A>): Predicate<A> => x => !f(x);

