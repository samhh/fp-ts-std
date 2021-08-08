/**
 * Various functions to aid in working with booleans and predicates.
 *
 * @since 0.1.0
 */

import { Predicate } from "fp-ts/Predicate"
import { Endomorphism } from "fp-ts/Endomorphism"
import { SemigroupAll, SemigroupAny } from "fp-ts/boolean"
import { curry2T } from "./Function"

/**
 * Invert a boolean.
 *
 * @example
 * import { invert } from 'fp-ts-std/Boolean';
 *
 * assert.strictEqual(invert(true), false);
 * assert.strictEqual(invert(false), true);
 *
 * @since 0.4.0
 */
export const invert: Endomorphism<boolean> = x => !x

/**
 * Returns `true` if both arguments are `true`, else `false`. Equivalent to
 * logical conjunction.
 *
 * @example
 * import { and } from 'fp-ts-std/Boolean';
 *
 * assert.strictEqual(and(true)(true), true);
 * assert.strictEqual(and(true)(false), false);
 *
 * @since 0.4.0
 */
export const and =
  (x: boolean): Endomorphism<boolean> =>
  y =>
    SemigroupAll.concat(x, y)

/**
 * Returns `true` if one or both arguments are `true`, else `false`. Equivalent
 * to logical disjunction.
 *
 * @example
 * import { or } from 'fp-ts-std/Boolean';
 *
 * assert.strictEqual(or(true)(false), true);
 * assert.strictEqual(or(false)(false), false);
 *
 * @since 0.4.0
 */
export const or =
  (x: boolean): Endomorphism<boolean> =>
  y =>
    SemigroupAny.concat(x, y)

/**
 * Returns `true` if one argument is `true` and the other is `false`, else
 * `false`. Equivalent to exclusive logical disjunction.
 *
 * @example
 * import { xor } from 'fp-ts-std/Boolean';
 *
 * assert.strictEqual(xor(true)(false), true);
 * assert.strictEqual(xor(true)(true), false);
 *
 * @since 0.4.0
 */
export const xor =
  (x: boolean): Endomorphism<boolean> =>
  y =>
    (x && !y) || (!x && y)

/**
 * Given an array of predicates, returns a predicate that returns true if the
 * argument passes all of the predicates.
 *
 * @example
 * import { allPass } from 'fp-ts-std/Boolean';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const gt3: Predicate<number> = n => n > 3;
 * const lt7: Predicate<number> = n => n < 7;
 * const even: Predicate<number> = n => n % 2 === 0;
 *
 * assert.strictEqual(allPass([gt3, lt7, even])(4), true);
 * assert.strictEqual(allPass([gt3, lt7, even])(5), false);
 *
 * @since 0.4.0
 */
export const allPass =
  <A>(fs: Array<Predicate<A>>): Predicate<A> =>
  x =>
    fs.every(f => f(x))

/**
 * Given an array of predicates, returns a predicate that returns true if the
 * argument passes any of the predicates.
 *
 * @example
 * import { anyPass } from 'fp-ts-std/Boolean';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const lt3: Predicate<number> = n => n < 3;
 * const gt7: Predicate<number> = n => n > 7;
 * const even: Predicate<number> = n => n % 2 === 0;
 *
 * assert.strictEqual(anyPass([lt3, gt7, even])(4), true);
 * assert.strictEqual(anyPass([lt3, gt7, even])(5), false);
 *
 * @since 0.4.0
 */
export const anyPass =
  <A>(fs: Array<Predicate<A>>): Predicate<A> =>
  x =>
    fs.some(f => f(x))

/**
 * Combine two predicates under conjunction in short-circuited fashion.
 *
 * @example
 * import { both } from 'fp-ts-std/Boolean';
 * import { Predicate } from 'fp-ts/Predicate';
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
export const both = curry2T(allPass)

/**
 * Combine two predicates under disjunction in short-circuited fashion.
 *
 * @example
 * import { either } from 'fp-ts-std/Boolean';
 * import { Predicate } from 'fp-ts/Predicate';
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
export const either = curry2T(anyPass)
