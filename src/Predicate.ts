/**
 * Various functions to aid in working with predicates. You may also find the
 * `Boolean` module relevant.
 *
 * @since 0.1.0
 */

import { Predicate } from "fp-ts/Predicate"
import * as A from "fp-ts/Array"
import { apply, flow, pipe } from "fp-ts/function"
import { invert } from "./Boolean"

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
 * Given an array of predicates, returns a predicate that returns true if the
 * argument passes none of the predicates.
 *
 * @example
 * import { nonePass } from 'fp-ts-std/Predicate';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const lt3: Predicate<number> = n => n < 3;
 * const gt7: Predicate<number> = n => n > 7;
 * const even: Predicate<number> = n => n % 2 === 0;
 *
 * assert.strictEqual(nonePass([lt3, gt7, even])(4), false);
 * assert.strictEqual(nonePass([lt3, gt7, even])(5), true);
 *
 * @since 0.4.0
 */

export const nonePass = <A>(fs: Array<Predicate<A>>): Predicate<A> =>
  flow(anyPass(fs), invert)
