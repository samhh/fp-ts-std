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
 * import { pipe } from 'fp-ts/function';
 * import { Predicate } from 'fp-ts/Predicate';
 * import { when } from 'fp-ts-std/Applicative';
 * import * as IO from 'fp-ts/IO';
 * import * as IOE from 'fp-ts/IOEither';
 * import { log } from 'fp-ts/Console';
 *
 * const isInvalid: Predicate<number> = n => n !== 42;
 *
 * pipe(
 *   IOE.of(123),
 *   IOE.chainFirstIOK(n =>
 *     when(IO.Applicative)(isInvalid(n))(log(n))),
 * );
 *
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
