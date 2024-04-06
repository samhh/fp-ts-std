/**
 * **This module is experimental.**
 *
 * Not to be confused with TypeScript's enums, this module refers to
 * enumeration, modelled similarly to PureScript's `BoundedEnum`.
 *
 * Most functions in this module are extremely expensive if called on instances
 * of very large types.
 *
 * @since 0.17.0
 */

import { Bounded } from "fp-ts/Bounded"
import * as O from "fp-ts/Option"
import { Ord } from "fp-ts/Ord"
import { constant, flow, pipe } from "fp-ts/function"
type Option<A> = O.Option<A>
import * as NEA from "fp-ts/NonEmptyArray"
import { unsafeExpect as unsafeExpectO } from "./Option"
type NonEmptyArray<A> = NEA.NonEmptyArray<A>
import * as A from "fp-ts/Array"
import { Eq } from "fp-ts/Eq"
import * as Map from "fp-ts/Map"
import * as Semigroup from "fp-ts/Semigroup"
import * as L from "./Lazy"
import { add, decrement, increment } from "./Number"
import { dup, toFst, toSnd } from "./Tuple"
type Lazy<A> = L.Lazy<A>

/**
 * Typeclass for finite enumerations.
 *
 * The retraction laws state that when operations succeed, `succ` and `pred`
 * reverse one-another:
 *   pred >=> succ >=> pred = pred
 *   succ >=> pred >=> succ = succ
 *
 * The non-skipping laws state that calls to `succ` and `pred` should not skip
 * any members of the given type. For example, an instance for a sum type of
 * ordered members `A`, `B`, and `C` should traverse the members like so:
 * `A <-> B <-> C`, skipping no member and following the order defined by the
 * `Ord` instance.
 *
 * `fromEnum` should always return an integer. `toEnum` should not accept
 * non-integer inputs. They should both be zero-based.
 *
 * @example
 * import * as Bool from 'fp-ts-std/Boolean'
 * import { universe } from 'fp-ts-std/Enum'
 *
 * assert.deepStrictEqual(universe(Bool.Enum), [false, true])
 *
 * @category 0 Types
 * @since 0.17.0
 */
export type Enum<A> = Bounded<A> & {
	succ: (x: A) => Option<A>
	pred: (x: A) => Option<A>
	toEnum: (index: number) => Option<A>
	fromEnum: (x: A) => number
	cardinality: Lazy<number>
}

const unfoldDup =
	<A>(f: (x: A) => Option<A>) =>
	(x: A): Array<A> =>
		A.unfold(x, flow(f, O.map(dup)))

const unfoldDup1 =
	<A>(f: (x: A) => Option<A>) =>
	(x: A): NonEmptyArray<A> =>
		pipe(unfoldDup(f)(x), A.prepend(x))

/**
 * Returns a contiguous sequence of elements between `start` and `end`
 * inclusive. Behaviour is unspecified if `end` is not greater than `start`.
 *
 * @example
 * import { fromTo } from 'fp-ts-std/Enum'
 * import { EnumInt } from 'fp-ts-std/Number'
 *
 * const range = fromTo(EnumInt)
 *
 * assert.deepStrictEqual(range(0)(3), [0, 1, 2, 3])
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const fromTo =
	<A>(E: Enum<A>) =>
	(start: A): ((limit: A) => NonEmptyArray<A>) =>
		fromThenTo(E)(start)(pipe(E.succ(start), O.getOrElse(constant(start))))

/**
 * Returns a sequence of elements from `first` until `limit` with step size
 * determined by the difference between `first` and `second`. Behaviour is
 * unspecified if `end` is not greater than `start` or `step` is non-positive.
 *
 * @example
 * import { fromThenTo } from 'fp-ts-std/Enum'
 * import { EnumInt } from 'fp-ts-std/Number'
 *
 * const f = fromThenTo(EnumInt)
 *
 * assert.deepStrictEqual(f(0)(2)(6), [0, 2, 4, 6])
 * assert.deepStrictEqual(f(0)(3)(5), [0, 3])
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const fromThenTo =
	<A>(E: Enum<A>) =>
	(first: A) =>
	(second: A) =>
	(limit: A): NonEmptyArray<A> => {
		const start = E.fromEnum(first)
		const step = E.fromEnum(second) - start
		const end = E.fromEnum(limit)

		// eslint-disable-next-line functional/no-conditional-statements
		if (step < 1 || end < start) return NEA.of(first)

		const f: (n: number) => Option<[number, number]> = flow(
			O.fromPredicate(n => n <= end),
			O.map(toSnd(add(step))),
		)

		return pipe(
			A.unfold(start, f),
			A.filterMap(E.toEnum),
			xs => xs as NonEmptyArray<A>,
		)
	}

/**
 * Produces all successors of `start` exclusive.
 *
 * @example
 * import { upFromExcl } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 *
 * const f = upFromExcl(EnumBool)
 *
 * assert.deepStrictEqual(f(false), [true])
 * assert.deepStrictEqual(f(true), [])
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const upFromExcl = <A>(E: Enum<A>): ((start: A) => Array<A>) =>
	unfoldDup(E.succ)

/**
 * Produces all successors of `start` inclusive.
 *
 * @example
 * import { upFromIncl } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 *
 * const f = upFromIncl(EnumBool)
 *
 * assert.deepStrictEqual(f(false), [false, true])
 * assert.deepStrictEqual(f(true), [true])
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const upFromIncl = <A>(E: Enum<A>): ((start: A) => NonEmptyArray<A>) =>
	unfoldDup1(E.succ)

/**
 * Produces all predecessors of `start` exclusive.
 *
 * @example
 * import { downFromExcl } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 *
 * const f = downFromExcl(EnumBool)
 *
 * assert.deepStrictEqual(f(true), [false])
 * assert.deepStrictEqual(f(false), [])
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const downFromExcl = <A>(E: Enum<A>): ((end: A) => Array<A>) =>
	unfoldDup(E.pred)

/**
 * Produces all predecessors of `start` inclusive.
 *
 * @example
 * import { downFromIncl } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 *
 * const f = downFromIncl(EnumBool)
 *
 * assert.deepStrictEqual(f(true), [true, false])
 * assert.deepStrictEqual(f(false), [false])
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const downFromIncl = <A>(E: Enum<A>): ((start: A) => NonEmptyArray<A>) =>
	unfoldDup1(E.pred)

/**
 * Provides a default, inefficient implementation of `cardinality`.
 *
 * @example
 * import { defaultCardinality } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 *
 * assert.strictEqual(defaultCardinality(EnumBool), 2)
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const defaultCardinality = <A>(
	E: Omit<Enum<A>, "cardinality">,
): number => {
	const f = (n: number): ((x: A) => number) =>
		flow(
			E.succ,
			O.match(
				constant(n),
				// eslint-disable-next-line functional/prefer-tacit
				x => f(n + 1)(x),
			),
		)

	return f(1)(E.bottom)
}

/**
 * Enumerates every value of an `Enum` in ascending order.
 *
 * @example
 * import { universe } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 *
 * assert.deepStrictEqual(universe(EnumBool), [false, true])
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const universe = <A>(E: Enum<A>): NonEmptyArray<A> =>
	fromTo(E)(E.bottom)(E.top)

/**
 * Creates a fallible function that's the inverse of `f`. `f` is expected to
 * return distinct `B` values for any given `A`; behaviour when this is not the
 * case is unspecified.
 *
 * Inverse mapping can be thought of as akin to a partial isomorphism. If the
 * types are totally isomorphic, consider instead defining an isomorphism to do
 * away with the infallibility.
 *
 * @example
 * import { inverseMap } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 * import { Show as ShowBool } from 'fp-ts/boolean'
 * import * as Str from 'fp-ts/string'
 * import * as O from 'fp-ts/Option'
 *
 * const parseBool = inverseMap(EnumBool)(Str.Eq)(ShowBool.show)
 *
 * assert.deepStrictEqual(parseBool("true"), O.some(true))
 * assert.deepStrictEqual(parseBool("false"), O.some(false))
 * assert.deepStrictEqual(parseBool("foobar"), O.none)
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const inverseMap =
	<A>(E: Enum<A>) =>
	<B>(Eq: Eq<B>) =>
	(f: (x: A) => B): ((x: B) => Option<A>) => {
		const ys = pipe(
			universe(E),
			NEA.map(toFst(f)),
			Map.fromFoldable(Eq, Semigroup.last<A>(), NEA.Foldable),
		)

		return x => Map.lookup(Eq)(x)(ys)
	}

/**
 * Produces an Enum instance that's potentially both unlawful and unsafe from a
 * list of values. Convenient for partially enumerating wide or deep types that
 * contain a few very large types such as strings.
 *
 * The instance will be unsafe if `xs` does not contain every member of `A`. If
 * this is the case, the only function that can throw is `fromEnum`.
 *
 * Behaviour in case of duplicate values is unspecified.
 *
 * @example
 * import { Enum, getUnsafeConstantEnum } from 'fp-ts-std/Enum'
 * import * as Bool from 'fp-ts/boolean'
 * import { Enum as EnumBool1 } from 'fp-ts-std/Boolean'
 *
 * // A safe instance equivalent to the real instance albeit with worse
 * // performance characteristics.
 * const EnumBool2: Enum<boolean> = getUnsafeConstantEnum(Bool.Ord)([false, true])
 *
 * assert.strictEqual(EnumBool2.fromEnum(true), 1)
 *
 * assert.strictEqual(EnumBool1.fromEnum(true), EnumBool2.fromEnum(true))
 * assert.strictEqual(EnumBool1.fromEnum(false), EnumBool2.fromEnum(false))
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const getUnsafeConstantEnum =
	<A>(Ord: Ord<A>) =>
	(xs: NonEmptyArray<A>): Enum<A> => {
		const f = (y: A): Option<number> =>
			pipe(
				xs,
				A.findIndex(z => Ord.equals(y, z)),
			)

		const g = (n: number): Option<A> => A.lookup(n)(xs)

		const sorted = NEA.sort(Ord)(xs)
		const Bounded: Bounded<A> = {
			...Ord,
			top: NEA.last(sorted),
			bottom: NEA.head(sorted),
		}

		return {
			...Bounded,
			succ: flow(f, O.chain(flow(increment, g))),
			pred: flow(f, O.chain(flow(decrement, g))),
			toEnum: g,
			fromEnum: flow(
				f,
				unsafeExpectO(
					"Failed to lookup fromEnum input via getUnsafeConstantEnum",
				),
			),
			cardinality: L.of(xs.length),
		}
	}
