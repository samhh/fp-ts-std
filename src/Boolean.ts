/**
 * @since 0.1.0
 */

import { Endomorphism, Predicate } from 'fp-ts/function';
import { getFunctionSemigroup, semigroupAll, semigroupAny } from 'fp-ts/Semigroup';

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

/**
 * Given an array of predicates, returns a predicate that returns true if the
 * argument passes all of the predicates.
 *
 * @since 0.4.0
 */
export const allPass = <A>(fs: Array<Predicate<A>>): Predicate<A> => x =>
    fs.every(f => f(x));

/**
 * Given an array of predicates, returns a predicate that returns true if the
 * argument passes any of the predicates.
 *
 * @since 0.4.0
 */
export const anyPass = <A>(fs: Array<Predicate<A>>): Predicate<A> => x =>
    fs.some(f => f(x));

/**
 * Combine two predicates under conjunction.
 *
 * @example
 * import { both } from 'fp-ts-std/Boolean';
 * import { Predicate } from 'fp-ts/function';
 *
 * const gt5: Predicate<number> = x => x > 5;
 * const lt10: Predicate<number> = x => x < 10;
 * const gt5AndLt10: Predicate<number> = both(gt5)(lt10);
 *
 * assert.strictEqual(gt5AndLt10(3), false);
 * assert.strictEqual(gt5AndLt10(8), true);
 * assert.strictEqual(gt5AndLt10(12), false);
 *
 * @since 0.5.0
 */
export const both = <A>(f: Predicate<A>): Endomorphism<Predicate<A>> => g =>
    getFunctionSemigroup(semigroupAll)<A>().concat(f, g);

/**
 * Combine two predicates under disjunction.
 *
 * @example
 * import { either } from 'fp-ts-std/Boolean';
 * import { Predicate } from 'fp-ts/function';
 *
 * const lt5: Predicate<number> = x => x < 5;
 * const gt10: Predicate<number> = x => x > 10;
 * const lt5OrGt10: Predicate<number> = either(lt5)(gt10);
 *
 * assert.strictEqual(lt5OrGt10(3), true);
 * assert.strictEqual(lt5OrGt10(8), false);
 * assert.strictEqual(lt5OrGt10(12), true);
 *
 * @since 0.5.0
 */
export const either = <A>(f: Predicate<A>): Endomorphism<Predicate<A>> => g =>
    getFunctionSemigroup(semigroupAny)<A>().concat(f, g);

