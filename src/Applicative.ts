/**
 * Utility functions to accommodate `fp-ts/Applicative`.
 *
 * @since 0.12.0
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
  Applicative,
  Applicative1,
  Applicative2,
  Applicative2C,
  Applicative3,
  Applicative3C,
  Applicative4,
} from "fp-ts/Applicative"

/**
 * Conditional execution of an applicative. Helpful for conditional side effects
 * like logging.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { Predicate } from 'fp-ts/Predicate'
 * import { when } from 'fp-ts-std/Applicative'
 * import * as IO from 'fp-ts/IO'
 * import * as IOE from 'fp-ts/IOEither'
 * import { log } from 'fp-ts/Console'
 *
 * const isInvalid: Predicate<number> = n => n !== 42
 *
 * pipe(
 *   IOE.of(123),
 *   IOE.chainFirstIOK(n =>
 *     when(IO.Applicative)(isInvalid(n))(log(n))),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export function when<F extends URIS4>(
  F: Applicative4<F>,
): (
  b: boolean,
) => <S, R, E>(x: Kind4<F, S, R, E, void>) => Kind4<F, S, R, E, void>
export function when<F extends URIS3>(
  F: Applicative3<F>,
): (b: boolean) => <R, E>(x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export function when<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): (b: boolean) => <R>(x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export function when<F extends URIS2>(
  F: Applicative2<F>,
): (b: boolean) => <E>(x: Kind2<F, E, void>) => Kind2<F, E, void>
export function when<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): (b: boolean) => (x: Kind2<F, E, void>) => Kind2<F, E, void>
export function when<F extends URIS>(
  F: Applicative1<F>,
): (b: boolean) => (x: Kind<F, void>) => Kind<F, void>
export function when<F>(
  F: Applicative<F>,
): (b: boolean) => (x: HKT<F, void>) => HKT<F, void> {
  return b => x => b ? x : F.of(undefined)
}

/**
 * The reverse of `when`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { Predicate } from 'fp-ts/Predicate'
 * import { unless } from 'fp-ts-std/Applicative'
 * import * as IO from 'fp-ts/IO'
 * import * as IOE from 'fp-ts/IOEither'
 * import { log } from 'fp-ts/Console'
 *
 * const isValid: Predicate<number> = n => n === 42
 *
 * pipe(
 *   IOE.of(123),
 *   IOE.chainFirstIOK(n =>
 *     unless(IO.Applicative)(isValid(n))(log(n))),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export function unless<F extends URIS4>(
  F: Applicative4<F>,
): (
  b: boolean,
) => <S, R, E>(x: Kind4<F, S, R, E, void>) => Kind4<F, S, R, E, void>
export function unless<F extends URIS3>(
  F: Applicative3<F>,
): (b: boolean) => <R, E>(x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export function unless<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): (b: boolean) => <R>(x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export function unless<F extends URIS2>(
  F: Applicative2<F>,
): (b: boolean) => <E>(x: Kind2<F, E, void>) => Kind2<F, E, void>
export function unless<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): (b: boolean) => (x: Kind2<F, E, void>) => Kind2<F, E, void>
export function unless<F extends URIS>(
  F: Applicative1<F>,
): (b: boolean) => (x: Kind<F, void>) => Kind<F, void>
export function unless<F>(
  F: Applicative<F>,
): (b: boolean) => (x: HKT<F, void>) => HKT<F, void> {
  return b => x => b ? F.of(undefined) : x
}

/**
 * Convenient alias for `F.of(undefined)`.
 *
 * @example
 * import { pipe, constant } from 'fp-ts/function'
 * import { pass } from 'fp-ts-std/Applicative'
 * import * as O from 'fp-ts/Option'
 * import Option = O.Option
 * import { IO, Applicative } from 'fp-ts/IO'
 * import { log } from 'fp-ts/Console'
 *
 * const mcount: Option<number> = O.some(123)
 *
 * const logCount: IO<void> = pipe(
 *   mcount,
 *   O.match(
 *     constant(pass(Applicative)),
 *     log,
 *   ),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export function pass<F extends URIS4, S, R, E>(
  F: Applicative4<F>,
): Kind4<F, S, R, E, void>
export function pass<F extends URIS3, R, E>(
  F: Applicative3<F>,
): Kind3<F, R, E, void>
export function pass<F extends URIS2, E>(F: Applicative2<F>): Kind2<F, E, void>
export function pass<F extends URIS>(F: Applicative1<F>): Kind<F, void>
export function pass<F>(F: Applicative<F>): HKT<F, void> {
  return F.of(undefined)
}
