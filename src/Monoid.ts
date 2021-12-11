/**
 * Utility functions to accommodate `fp-ts/Monoid`.
 *
 * @since 0.12.0
 */

import {
  Foldable,
  Foldable1,
  Foldable2,
  Foldable2C,
  Foldable3,
  Foldable3C,
  Foldable4,
} from "fp-ts/Foldable"
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
import { Monoid } from "fp-ts/Monoid"
import { flow, identity } from "fp-ts/function"
import { Endomorphism } from "fp-ts/lib/Endomorphism"
import { invert } from "./Boolean"

/**
 * Extracts the value from within a foldable, falling back to the monoidal
 * identity of said value.
 *
 * @example
 * import { toMonoid } from 'fp-ts-std/Monoid';
 * import * as O from 'fp-ts/Option';
 * import * as Str from 'fp-ts/string';
 *
 * const f = toMonoid(O.Foldable)(Str.Monoid)
 *
 * assert.deepStrictEqual(f(O.some('x')), 'x');
 * assert.deepStrictEqual(f(O.none), '');
 *
 * @since 0.12.0
 */
export function toMonoid<F extends URIS4>(
  F: Foldable4<F>,
): <A, S, R, E>(G: Monoid<A>) => (x: Kind4<F, S, R, E, A>) => A
export function toMonoid<F extends URIS3>(
  F: Foldable3<F>,
): <A, R, E>(G: Monoid<A>) => (x: Kind3<F, R, E, A>) => A
export function toMonoid<F extends URIS3, E>(
  F: Foldable3C<F, E>,
): <A, R>(G: Monoid<A>) => (x: Kind3<F, R, E, A>) => A
export function toMonoid<F extends URIS2>(
  F: Foldable2<F>,
): <A, E>(G: Monoid<A>) => (x: Kind2<F, E, A>) => A
export function toMonoid<F extends URIS2, E>(
  F: Foldable2C<F, E>,
): <A>(G: Monoid<A>) => (x: Kind2<F, E, A>) => A
export function toMonoid<F extends URIS>(
  F: Foldable1<F>,
): <A>(G: Monoid<A>) => (x: Kind<F, A>) => A
export function toMonoid<F>(
  F: Foldable<F>,
): <A>(G: Monoid<A>) => (x: HKT<F, A>) => A {
  return G => x => F.foldMap(G)(x, identity)
}

/**
 * Conditionally returns the provided monoidal value or its identity. The dual
 * to `memptyUnless`.
 *
 * @example
 * import { memptyWhen } from 'fp-ts-std/Monoid';
 * import * as O from 'fp-ts/Option';
 * import * as Str from 'fp-ts/string';
 *
 * const f = memptyWhen(O.getMonoid(Str.Monoid));
 *
 * assert.deepStrictEqual(f(true)(O.some('x')), O.none);
 * assert.deepStrictEqual(f(true)(O.none), O.none);
 * assert.deepStrictEqual(f(false)(O.some('x')), O.some('x'));
 * assert.deepStrictEqual(f(false)(O.none), O.none);
 *
 * @since 0.13.0
 */
export const memptyWhen =
  <A>(M: Monoid<A>) =>
  (x: boolean): Endomorphism<A> =>
  y =>
    x ? M.empty : y

/**
 * Conditionally returns the provided monoidal value or its identity. The dual
 * to `memptyWhen`.
 *
 * @example
 * import { memptyUnless } from 'fp-ts-std/Monoid';
 * import * as O from 'fp-ts/Option';
 * import * as Str from 'fp-ts/string';
 *
 * const f = memptyUnless(O.getMonoid(Str.Monoid));
 *
 * assert.deepStrictEqual(f(true)(O.some('x')), O.some('x'));
 * assert.deepStrictEqual(f(true)(O.none), O.none);
 * assert.deepStrictEqual(f(false)(O.some('x')), O.none);
 * assert.deepStrictEqual(f(false)(O.none), O.none);
 *
 * @since 0.13.0
 */
export const memptyUnless = <A>(
  M: Monoid<A>,
): ((x: boolean) => Endomorphism<A>) => flow(invert, memptyWhen(M))
