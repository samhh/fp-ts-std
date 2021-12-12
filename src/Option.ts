/**
 * Utility functions to accommodate `fp-ts/Option`.
 *
 * @since 0.1.0
 */

import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { Eq } from "fp-ts/Eq"
import { Endomorphism } from "fp-ts/Endomorphism"
import { constant, flow } from "fp-ts/function"
import * as B from "fp-ts/boolean"
import { invert as invertBool } from "./Boolean"
import { pureIf as _pureIf } from "./Alternative"
import { toMonoid as _toMonoid } from "./Monoid"

/**
 * Unwrap the value from within an `Option`, throwing if `None`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/Option';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(unsafeUnwrap(O.some(5)), 5);
 *
 * @since 0.1.0
 */
export const unsafeUnwrap = <A>(x: Option<A>): A => {
  // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
  if (O.isNone(x)) throw "Unsafe attempt to unwrap Option failed"

  return x.value
}

/**
 * A thunked `None` constructor. Enables specifying the type of the `Option`
 * without a type assertion. Helpful in certain circumstances in which type
 * inferrence isn't smart enough to unify with the `Option<never>` of the
 * standard `None` constructor.
 *
 * @example
 * import { noneAs } from 'fp-ts-std/Option';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(noneAs<any>(), O.none);
 *
 * @since 0.12.0
 */
export const noneAs = <A>(): Option<A> => O.none

/**
 * Given an unwrapped value and an associated `Eq` instance for determining
 * equivalence, inverts an `Option` that may contain the same value, something
 * else, or nothing.
 *
 * This can be useful for circumstances in which you want to in a sense toggle
 * an `Option` value.
 *
 * @example
 * import { invert } from 'fp-ts-std/Option';
 * import * as O from 'fp-ts/Option';
 * import * as S from 'fp-ts/string';
 *
 * const f = invert(S.Eq)('x');
 *
 * assert.deepStrictEqual(f(O.none), O.some('x'));
 * assert.deepStrictEqual(f(O.some('y')), O.some('x'));
 * assert.deepStrictEqual(f(O.some('x')), O.none);
 *
 * @since 0.12.0
 */
export const invert =
  <A>(eq: Eq<A>) =>
  (val: A): Endomorphism<O.Option<A>> =>
    flow(
      O.exists(x => eq.equals(x, val)),
      B.match(() => O.some(val), constant(O.none)),
    )

/**
 * Extracts monoidal identity if `None`.
 *
 * @example
 * import { toMonoid } from 'fp-ts-std/Option';
 * import * as O from 'fp-ts/Option';
 * import * as Str from 'fp-ts/string';
 *
 * const f = toMonoid(Str.Monoid)
 *
 * assert.deepStrictEqual(f(O.some('x')), 'x');
 * assert.deepStrictEqual(f(O.none), '');
 *
 * @since 0.12.0
 */
export const toMonoid = _toMonoid(O.Foldable)

// These aren't defined in terms of Monoid memptyWhen/Unless because then we'd
// need a redundant `Monoid<A>` input.
/**
 * Conditionally returns the provided `Option` or `None`. The dual to
 * `memptyUnless`.
 *
 * @example
 * import { memptyWhen } from 'fp-ts-std/Option';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(memptyWhen(true)(O.some('x')), O.none);
 * assert.deepStrictEqual(memptyWhen(true)(O.none), O.none);
 * assert.deepStrictEqual(memptyWhen(false)(O.some('x')), O.some('x'));
 * assert.deepStrictEqual(memptyWhen(false)(O.none), O.none);
 *
 * @since 0.13.0
 */
export const memptyWhen =
  (x: boolean) =>
  <A>(m: Option<A>): Option<A> =>
    x ? O.none : m

/**
 * Conditionally returns the provided `Option` or `None`. The dual to
 * `memptyWhen`.
 *
 * @example
 * import { memptyUnless } from 'fp-ts-std/Option';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(memptyUnless(true)(O.some('x')), O.some('x'));
 * assert.deepStrictEqual(memptyUnless(true)(O.none), O.none);
 * assert.deepStrictEqual(memptyUnless(false)(O.some('x')), O.none);
 * assert.deepStrictEqual(memptyUnless(false)(O.none), O.none);
 *
 * @since 0.13.0
 */
export const memptyUnless: (x: boolean) => <A>(m: Option<A>) => Option<A> =
  flow(invertBool, memptyWhen)

/**
 * Conditionally lifts a value to `Some` or returns `None`.
 *
 * @example
 * import { pureIf } from 'fp-ts-std/Option';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const person = { name: 'Hodor', age: 40 };
 * const isMagicNumber: Predicate<number> = n => n === 42;
 *
 * const mname = pureIf(isMagicNumber(person.age))(person.name);
 *
 * @since 0.13.0
 */
export const pureIf: (x: boolean) => <A>(y: A) => Option<A> = _pureIf(
  O.Alternative,
)
