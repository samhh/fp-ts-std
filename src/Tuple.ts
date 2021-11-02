/**
 * Various functions to aid in working with tuples.
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
  Functor,
  Functor1,
  Functor2,
  Functor3,
  Functor4,
  Functor2C,
} from "fp-ts/Functor"
import { fork } from "./Function"
import { identity } from "fp-ts/function"

/**
 * Duplicate a value into a tuple.
 *
 * @example
 * import { dup } from 'fp-ts-std/Tuple';
 *
 * assert.deepStrictEqual(dup('x'), ['x', 'x']);
 *
 * @since 0.12.0
 */
export const dup: <A>(x: A) => [A, A] = fork([identity, identity])

/**
 * Apply a function, collecting the output alongside the input. A dual to
 * `toSnd`.
 *
 * @example
 * import { toFst } from 'fp-ts-std/Tuple';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(toFst(fromNumber)(5), ['5', 5]);
 *
 * @since 0.12.0
 */
export const toFst = <A, B>(f: (x: A) => B): ((x: A) => [B, A]) =>
  fork([f, identity])

/**
 * Apply a function, collecting the input alongside the output. A dual to
 * `toFst`.
 *
 * @example
 * import { toFst } from 'fp-ts-std/Tuple';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(toFst(fromNumber)(5), ['5', 5]);
 *
 * @since 0.12.0
 */
export const toSnd = <A, B>(f: (x: A) => B): ((x: A) => [A, B]) =>
  fork([identity, f])

/**
 * Apply a functorial function, collecting the output alongside the input. A
 * dual to `traverseToSnd`.
 *
 * @example
 * import { traverseToFst } from 'fp-ts-std/Tuple';
 * import * as O from 'fp-ts/Option';
 * import { flow, constant } from 'fp-ts/function';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * const traverseToFstO = traverseToFst(O.Functor);
 * const fromNumberO = flow(fromNumber, O.some);
 *
 * assert.deepStrictEqual(traverseToFstO(fromNumberO)(5), O.some(['5', 5]));
 * assert.deepStrictEqual(traverseToFstO(constant(O.none))(5), O.none);
 *
 * @since 0.12.0
 */
export function traverseToFst<F extends URIS4>(
  F: Functor4<F>,
): <S, R, E, A, B>(
  g: (x: A) => Kind4<F, S, R, E, B>,
) => (x: A) => Kind4<F, S, R, E, [B, A]>
export function traverseToFst<F extends URIS3>(
  F: Functor3<F>,
): <R, E, A, B>(
  g: (x: A) => Kind3<F, R, E, B>,
) => (x: A) => Kind3<F, R, E, [B, A]>
export function traverseToFst<F extends URIS2>(
  F: Functor2<F>,
): <E, A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [B, A]>
export function traverseToFst<F extends URIS2, E>(
  F: Functor2C<F, E>,
): <A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [B, A]>
export function traverseToFst<F extends URIS>(
  F: Functor1<F>,
): <A, B>(g: (x: A) => Kind<F, B>) => (x: A) => Kind<F, [B, A]>
export function traverseToFst<F>(
  F: Functor<F>,
): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [B, A]>
export function traverseToFst<F>(
  F: Functor<F>,
): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [B, A]> {
  return g => x => F.map(g(x), y => [y, x])
}

/**
 * Apply a functorial function, collecting the input alongside the output. A
 * dual to `traverseToFst`.
 *
 * @example
 * import { traverseToSnd } from 'fp-ts-std/Tuple';
 * import * as O from 'fp-ts/Option';
 * import { flow, constant } from 'fp-ts/function';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * const traverseToSndO = traverseToSnd(O.Functor);
 * const fromNumberO = flow(fromNumber, O.some);
 *
 * assert.deepStrictEqual(traverseToSndO(fromNumberO)(5), O.some([5, '5']));
 * assert.deepStrictEqual(traverseToSndO(constant(O.none))(5), O.none);
 *
 * @since 0.12.0
 */
export function traverseToSnd<F extends URIS4>(
  F: Functor4<F>,
): <S, R, E, A, B>(
  g: (x: A) => Kind4<F, S, R, E, B>,
) => (x: A) => Kind4<F, S, R, E, [A, B]>
export function traverseToSnd<F extends URIS3>(
  F: Functor3<F>,
): <R, E, A, B>(
  g: (x: A) => Kind3<F, R, E, B>,
) => (x: A) => Kind3<F, R, E, [A, B]>
export function traverseToSnd<F extends URIS2>(
  F: Functor2<F>,
): <E, A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [A, B]>
export function traverseToSnd<F extends URIS2, E>(
  F: Functor2C<F, E>,
): <A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [A, B]>
export function traverseToSnd<F extends URIS>(
  F: Functor1<F>,
): <A, B>(g: (x: A) => Kind<F, B>) => (x: A) => Kind<F, [A, B]>
export function traverseToSnd<F>(
  F: Functor<F>,
): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [A, B]>
export function traverseToSnd<F>(
  F: Functor<F>,
): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [A, B]> {
  return g => x => F.map(g(x), y => [x, y])
}

/**
 * Curried tuple construction. A dual to `withSnd`. Equivalent to Haskell's
 * tuple sections.
 *
 * @example
 * import { pipe } from 'fp-ts/function';
 * import { withFst } from 'fp-ts-std/Tuple';
 *
 * assert.deepStrictEqual(pipe('x', withFst('y')), ['y', 'x']);
 *
 * @since 0.12.0
 */
export const withFst =
  <A>(x: A) =>
  <B>(y: B): [A, B] =>
    [x, y]

/**
 * Curried tuple construction. A dual to `withFst`. Equivalent to Haskell's
 * tuple sections.
 *
 * @example
 * import { pipe } from 'fp-ts/function';
 * import { withSnd } from 'fp-ts-std/Tuple';
 *
 * assert.deepStrictEqual(pipe('x', withSnd('y')), ['x', 'y']);
 *
 * @since 0.12.0
 */
export const withSnd =
  <A>(x: A) =>
  <B>(y: B): [B, A] =>
    [y, x]

/**
 * Create a tuple. Helps with fighting TypeScript's type inferrence without
 * having to repeat yourself or use `as const`.
 *
 * @example
 * import { create } from 'fp-ts-std/Tuple';
 *
 * assert.deepStrictEqual(create(['x', 'y']), ['x', 'y']);
 *
 * @since 0.12.0
 */
export const create: <A, B>(xs: [A, B]) => [A, B] = identity
