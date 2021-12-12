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

/**
 * Conditionally lifts a value to an `Alternative` context or returns
 * empty/zero.
 *
 * @example
 * import { pureIf } from 'fp-ts-std/Alternative';
 * import * as O from 'fp-ts/Option';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const person = { name: 'Hodor', age: 40 };
 * const isMagicNumber: Predicate<number> = n => n === 42;
 *
 * const mname = pureIf(O.Alternative)(isMagicNumber(person.age))(person.name);
 *
 * @since 0.13.0
 */
export function pureIf<F extends URIS4, S, R, E>(
  F: Alternative4<F>,
): (x: boolean) => <A>(y: A) => Kind4<F, S, R, E, A>
export function pureIf<F extends URIS3, R, E>(
  F: Alternative3<F>,
): (x: boolean) => <A>(y: A) => Kind3<F, R, E, A>
export function pureIf<F extends URIS3, R, E>(
  F: Alternative3C<F, E>,
): (x: boolean) => <A>(y: A) => Kind3<F, R, E, A>
export function pureIf<F extends URIS2, E>(
  F: Alternative2<F>,
): (x: boolean) => <A>(y: A) => Kind2<F, E, A>
export function pureIf<F extends URIS2, E>(
  F: Alternative2C<F, E>,
): (x: boolean) => <A>(y: A) => Kind2<F, E, A>
export function pureIf<F extends URIS>(
  F: Alternative1<F>,
): (x: boolean) => <A>(y: A) => Kind<F, A>
export function pureIf<F>(
  F: Alternative<F>,
): (x: boolean) => <A>(y: A) => HKT<F, A> {
  return x => (x ? F.of : F.zero)
}
