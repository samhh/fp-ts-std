/**
 * Utility functions to accommodate `fp-ts/Bifunctor`.
 *
 * @since 0.14.0
 */

import { HKT2, Kind2, Kind3, Kind4, URIS2, URIS3, URIS4 } from "fp-ts/HKT"
import {
  Bifunctor,
  Bifunctor2,
  Bifunctor2C,
  Bifunctor3,
  Bifunctor3C,
  Bifunctor4,
} from "fp-ts/lib/Bifunctor.js"

/**
 * Apply a function to both elements of a bifunctor.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { mapBoth } from 'fp-ts-std/Bifunctor'
 * import * as Tuple from 'fp-ts/Tuple'
 * import { multiply } from 'fp-ts-std/Number'
 *
 * const xs = pipe([3, 5], mapBoth(Tuple.Bifunctor)(multiply(2)))
 *
 * assert.deepStrictEqual(xs, [6, 10])
 *
 * @category 2 Typeclass Methods
 * @since 0.14.0
 */
export function mapBoth<F extends URIS4>(
  F: Bifunctor4<F>,
): <A, B>(
  f: (x: A) => B,
) => <S, R>(x: Kind4<F, S, R, A, A>) => Kind4<F, S, R, B, B>
export function mapBoth<F extends URIS3>(
  F: Bifunctor3<F>,
): <A, B>(f: (x: A) => B) => <R>(x: Kind3<F, R, A, A>) => Kind3<F, R, B, B>
export function mapBoth<F extends URIS3, E>(
  F: Bifunctor3C<F, E>,
): <B>(f: (x: E) => B) => <R>(x: Kind3<F, R, E, E>) => Kind3<F, R, B, B>
export function mapBoth<F extends URIS2>(
  F: Bifunctor2<F>,
): <A, B>(f: (x: A) => B) => (x: Kind2<F, A, A>) => Kind2<F, B, B>
export function mapBoth<F extends URIS2, E>(
  F: Bifunctor2C<F, E>,
): <B>(f: (x: E) => B) => (x: Kind2<F, E, E>) => Kind2<F, B, B>
export function mapBoth<F extends URIS2>(
  F: Bifunctor<F>,
): <A, B>(f: (x: A) => B) => (x: Kind2<F, A, A>) => Kind2<F, B, B>
export function mapBoth<F>(
  F: Bifunctor<F>,
): <A, B>(f: (x: A) => B) => (x: HKT2<F, A, A>) => HKT2<F, B, B> {
  return f => x => F.bimap(x, f, f)
}
