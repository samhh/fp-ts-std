/**
 * Utility functions to accommodate `fp-ts/Alternative`.
 *
 * @since 0.13.0
 */

import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from "fp-ts/HKT"
import {
  Alternative,
  Alternative1,
  Alternative2,
  Alternative2C,
  Alternative3,
  Alternative3C,
  Alternative4,
} from "fp-ts/Alternative"
import { Lazy } from "./Lazy"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"

/**
 * Conditionally lifts a value to an `Alternative` context or returns
 * empty/zero. The lazy value is evaluated only if the condition passes.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { pureIf } from 'fp-ts-std/Alternative'
 * import * as O from 'fp-ts/Option'
 * import { Predicate } from 'fp-ts/Predicate'
 *
 * const person = { name: 'Hodor', age: 40 }
 * const isMagicNumber: Predicate<number> = n => n === 42
 *
 * const mname = pureIf(O.Alternative)(isMagicNumber(person.age))(constant(person.name))
 *
 * @category 2 Typeclass Methods
 * @since 0.13.0
 */
export function pureIf<F extends URIS4, S, R, E>(
  F: Alternative4<F>,
): (x: boolean) => <A>(y: Lazy<A>) => Kind4<F, S, R, E, A>
export function pureIf<F extends URIS3, R, E>(
  F: Alternative3<F>,
): (x: boolean) => <A>(y: Lazy<A>) => Kind3<F, R, E, A>
export function pureIf<F extends URIS3, R, E>(
  F: Alternative3C<F, E>,
): (x: boolean) => <A>(y: Lazy<A>) => Kind3<F, R, E, A>
export function pureIf<F extends URIS2, E>(
  F: Alternative2<F>,
): (x: boolean) => <A>(y: Lazy<A>) => Kind2<F, E, A>
export function pureIf<F extends URIS2, E>(
  F: Alternative2C<F, E>,
): (x: boolean) => <A>(y: Lazy<A>) => Kind2<F, E, A>
export function pureIf<F extends URIS>(
  F: Alternative1<F>,
): (x: boolean) => <A>(y: Lazy<A>) => Kind<F, A>
export function pureIf<F>(
  F: Alternative<F>,
): (x: boolean) => <A>(y: Lazy<A>) => HKT<F, A> {
  return x => y => (x ? F.of(y()) : F.zero())
}

/**
 * Like `altAll`, but flaps an input across an array of functions to produce
 * the `Alternative` values, short-circuiting upon a non-empty value. Useful for
 * `Alternative` types without inherent laziness.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { altAllBy } from 'fp-ts-std/Alternative'
 * import * as O from 'fp-ts/Option'
 *
 * const f = altAllBy(O.Alternative)
 *
 * assert.deepStrictEqual(
 *   f([constant(O.none), O.some])('foo'),
 *   O.some('foo'),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export function altAllBy<F extends URIS4>(
  F: Alternative4<F>,
): <S, R, E, B, A>(
  fs: Array<(x: A) => Kind4<F, S, R, E, B>>,
) => (x: A) => Kind4<F, S, R, E, B>
export function altAllBy<F extends URIS3>(
  F: Alternative3<F>,
): <R, E, B, A>(
  fs: Array<(x: A) => Kind3<F, R, E, B>>,
) => (x: A) => Kind3<F, R, E, B>
export function altAllBy<F extends URIS3, E>(
  F: Alternative3C<F, E>,
): <R, B, A>(
  fs: Array<(x: A) => Kind3<F, R, E, B>>,
) => (x: A) => Kind3<F, R, E, B>
export function altAllBy<F extends URIS2>(
  F: Alternative2<F>,
): <E, B, A>(fs: Array<(x: A) => Kind2<F, E, B>>) => (x: A) => Kind2<F, E, B>
export function altAllBy<F extends URIS2, E>(
  F: Alternative2C<F, E>,
): <B, A>(fs: Array<(x: A) => Kind2<F, E, B>>) => (x: A) => Kind2<F, E, B>
export function altAllBy<F extends URIS>(
  F: Alternative1<F>,
): <B, A>(fs: Array<(x: A) => Kind<F, B>>) => (x: A) => Kind<F, B>
export function altAllBy<F>(
  F: Alternative<F>,
): <B, A>(fs: Array<(x: A) => HKT<F, B>>) => (x: A) => HKT<F, B>
export function altAllBy<F>(
  F: Alternative<F>,
): <B, A>(fs: Array<(x: A) => HKT<F, B>>) => (x: A) => HKT<F, B> {
  return fs => x =>
    pipe(
      fs,
      A.reduce(F.zero(), (m, f) => F.alt(m, () => f(x))),
    )
}
