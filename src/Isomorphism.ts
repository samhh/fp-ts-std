/**
 * This module and its namesake type formalise the notion of isomorphism.
 *
 * Two types which are isomorphic can be considered for all intents and
 * purposes to be equivalent. Any two types with the same cardinality are
 * isomorphic, for example `boolean` and `0 | 1`. It is potentially possible to
 * define many valid isomorphisms between two types.
 *
 * @since 0.13.0
 */

import { Iso } from "monocle-ts/Iso"
import { Semigroup } from "fp-ts/Semigroup"

/**
 * An isomorphism is formed between two reversible, lossless functions. The
 * order of the types is irrelevant.
 *
 * @since 0.13.0
 */
export type Isomorphism<A, B> = {
  to: (x: A) => B
  from: (x: B) => A
}

/**
 * `Isomorphism` and `Iso` themselves are isomorphic!
 */
const getIsoIso = <A, B>(): Isomorphism<Isomorphism<A, B>, Iso<A, B>> => ({
  to: I => ({ get: I.to, reverseGet: I.from }),
  from: I => ({ to: I.get, from: I.reverseGet }),
})

/**
 * Convert an `Isomorphism` to a monocle-ts `Iso`.
 *
 * @since 0.13.0
 */
export const toIso = <A, B>(I: Isomorphism<A, B>): Iso<A, B> =>
  getIsoIso<A, B>().to(I)

/**
 * Convert a monocle-ts `Iso` to an `Isomorphism`.
 *
 * @since 0.13.0
 */
export const fromIso = <A, B>(I: Iso<A, B>): Isomorphism<A, B> =>
  getIsoIso<A, B>().from(I)

/**
 * Reverse the order of the types in an `Isomorphism`.
 *
 * @since 0.13.0
 */
export const reverse = <A, B>(I: Isomorphism<A, B>): Isomorphism<B, A> => ({
  to: I.from,
  from: I.to,
})

/**
 * Derive a `Semigroup` for `B` given a `Semigroup` for `A` and an
 * `Isomorphism` between the two types.
 *
 * @example
 * import * as Iso from 'fp-ts-std/Isomorphism';
 * import { Isomorphism } from 'fp-ts-std/Isomorphism';
 * import * as Bool from 'fp-ts/boolean';
 *
 * type Binary = 0 | 1;
 *
 * const isoBoolBinary: Isomorphism<boolean, Binary> = {
 *   to: x => x ? 1 : 0,
 *   from: Boolean,
 * };
 *
 * const semigroupBinaryAll = Iso.deriveSemigroup(isoBoolBinary)(Bool.SemigroupAll);
 *
 * assert.strictEqual(semigroupBinaryAll.concat(0, 1), 0);
 * assert.strictEqual(semigroupBinaryAll.concat(1, 1), 1);
 *
 * @since 0.13.0
 */
export const deriveSemigroup =
  <A, B>(I: Isomorphism<A, B>) =>
  (S: Semigroup<A>): Semigroup<B> => ({
    concat: (x, y) => I.to(S.concat(I.from(x), I.from(y))),
  })
