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
import { Monoid } from "fp-ts/Monoid"
import { flow } from "fp-ts/function"

/**
 * An isomorphism is formed between two reversible, lossless functions. The
 * order of the types is irrelevant.
 *
 * @category 0 Types
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
 * @category 3 Functions
 * @since 0.13.0
 */
// eslint-disable-next-line functional/prefer-tacit
export const toIso = <A, B>(I: Isomorphism<A, B>): Iso<A, B> =>
	getIsoIso<A, B>().to(I)

/**
 * Convert a monocle-ts `Iso` to an `Isomorphism`.
 *
 * @category 3 Functions
 * @since 0.13.0
 */
// eslint-disable-next-line functional/prefer-tacit
export const fromIso = <A, B>(I: Iso<A, B>): Isomorphism<A, B> =>
	getIsoIso<A, B>().from(I)

/**
 * Reverse the order of the types in an `Isomorphism`.
 *
 * @category 3 Functions
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
 * import * as Iso from 'fp-ts-std/Isomorphism'
 * import { Isomorphism } from 'fp-ts-std/Isomorphism'
 * import * as Bool from 'fp-ts/boolean'
 *
 * type Binary = 0 | 1
 *
 * const isoBoolBinary: Isomorphism<boolean, Binary> = {
 *   to: x => x ? 1 : 0,
 *   from: Boolean,
 * }
 *
 * const semigroupBinaryAll = Iso.deriveSemigroup(isoBoolBinary)(Bool.SemigroupAll)
 *
 * assert.strictEqual(semigroupBinaryAll.concat(0, 1), 0)
 * assert.strictEqual(semigroupBinaryAll.concat(1, 1), 1)
 *
 * @category 1 Typeclass Instances
 * @since 0.13.0
 */
export const deriveSemigroup =
	<A, B>(I: Isomorphism<A, B>) =>
	(S: Semigroup<A>): Semigroup<B> => ({
		concat: (x, y) => I.to(S.concat(I.from(x), I.from(y))),
	})

/**
 * Derive a `Monoid` for `B` given a `Monoid` for `A` and an
 * `Isomorphism` between the two types.
 *
 * @example
 * import * as Iso from 'fp-ts-std/Isomorphism'
 * import { Isomorphism } from 'fp-ts-std/Isomorphism'
 * import * as Bool from 'fp-ts/boolean'
 *
 * type Binary = 0 | 1
 *
 * const isoBoolBinary: Isomorphism<boolean, Binary> = {
 *   to: x => x ? 1 : 0,
 *   from: Boolean,
 * }
 *
 * const monoidBinaryAll = Iso.deriveMonoid(isoBoolBinary)(Bool.MonoidAll)
 *
 * assert.strictEqual(monoidBinaryAll.empty, 1)
 * assert.strictEqual(monoidBinaryAll.concat(0, 1), 0)
 * assert.strictEqual(monoidBinaryAll.concat(1, 1), 1)
 *
 * @category 1 Typeclass Instances
 * @since 0.13.0
 */
export const deriveMonoid =
	<A, B>(I: Isomorphism<A, B>) =>
	(M: Monoid<A>): Monoid<B> => ({
		empty: I.to(M.empty),
		concat: (x, y) => I.to(M.concat(I.from(x), I.from(y))),
	})

// Whilst `(b -> c) -> (a -> b) -> a -> c` would be much cuter and match the
// shape of Haskell's composition operator, this left-to-right order makes more
// sense in an fp-ts context.
/**
 * Isomorphisms can be composed together much like functions. Consider this
 * type signature a window into category theory!
 *
 * @example
 * import * as Iso from 'fp-ts-std/Isomorphism'
 * import { Isomorphism } from 'fp-ts-std/Isomorphism'
 * import * as E from 'fp-ts/Either'
 * import { Either } from 'fp-ts/Either'
 *
 * type Side = Either<null, null>
 * type Binary = 0 | 1
 *
 * const isoSideBool: Isomorphism<Side, boolean> = {
 *   to: E.isRight,
 *   from: x => x ? E.right(null) : E.left(null),
 * }
 *
 * const isoBoolBinary: Isomorphism<boolean, Binary> = {
 *   to: x => x ? 1 : 0,
 *   from: Boolean,
 * }
 *
 * const isoSideBinary: Isomorphism<Side, Binary> = Iso.compose(isoSideBool)(isoBoolBinary)
 *
 * assert.strictEqual(isoSideBinary.to(E.left(null)), 0)
 * assert.strictEqual(isoSideBinary.to(E.right(null)), 1)
 * assert.deepStrictEqual(isoSideBinary.from(0), E.left(null))
 * assert.deepStrictEqual(isoSideBinary.from(1), E.right(null))
 *
 * @category 3 Functions
 * @since 0.13.0
 */
export const compose =
	<A, B>(F: Isomorphism<A, B>) =>
	<C>(G: Isomorphism<B, C>): Isomorphism<A, C> => ({
		to: flow(F.to, G.to),
		from: flow(G.from, F.from),
	})
