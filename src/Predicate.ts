/**
 * Various functions to aid in working with predicates. You may also find the
 * `Boolean` module relevant.
 *
 * @since 0.1.0
 */

import { Predicate } from "fp-ts/Predicate"
import * as A from "fp-ts/Array"
import { apply, pipe } from "fp-ts/function"
import { curry2T } from "./Function"

/**
 * Given an array of predicates, returns a predicate that returns true if the
 * argument passes all of the predicates.
 *
 * @example
 * import { allPass } from 'fp-ts-std/Predicate';
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
    pipe(fs, A.every(apply(x)))

/**
 * Given an array of predicates, returns a predicate that returns true if the
 * argument passes any of the predicates.
 *
 * @example
 * import { anyPass } from 'fp-ts-std/Predicate';
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
    pipe(fs, A.some(apply(x)))

/**
 * Combine two predicates under conjunction in short-circuited fashion.
 *
 * @example
 * import { both } from 'fp-ts-std/Predicate';
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
 * import { either } from 'fp-ts-std/Predicate';
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
