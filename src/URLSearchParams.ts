/**
 * Various functions to aid in working with JavaScript's `URLSearchParams`
 * interface. It can be thought of similarly to `Map<string, Array<string>>`.
 *
 * @since 0.2.0
 */

import * as M from "fp-ts/Map"
import * as NEA from "fp-ts/NonEmptyArray"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { Predicate, not } from "fp-ts/Predicate"
import * as R from "fp-ts/Record"
import { Refinement } from "fp-ts/Refinement"
import { constant, flow, pipe } from "fp-ts/function"
import { invoke, isInstanceOf, uncurry2, when } from "./Function"
type NonEmptyArray<A> = NEA.NonEmptyArray<A>
import * as A from "fp-ts/Array"
import { Endomorphism } from "fp-ts/Endomorphism"
import * as Eq_ from "fp-ts/Eq"
import { mapSnd } from "fp-ts/Tuple"
import * as Str from "fp-ts/string"
import { fromIterable, getDisorderedEq } from "./Array"
import { prepend } from "./String"
import { withFst } from "./Tuple"
type Eq<A> = Eq_.Eq<A>
import * as Monoid_ from "fp-ts/Monoid"
import type { Semigroup as SemigroupT } from "fp-ts/Semigroup"
type Monoid<A> = Monoid_.Monoid<A>

const constructor = (
	x: ConstructorParameters<typeof URLSearchParams>[0],
): URLSearchParams => new URLSearchParams(x)

/**
 * An empty `URLSearchParams`.
 *
 * @example
 * import { empty } from 'fp-ts-std/URLSearchParams'
 *
 * assert.deepStrictEqual(empty, new URLSearchParams())
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const empty: URLSearchParams = constructor(undefined)

/**
 * Test if there are any search params.
 *
 * @example
 * import { isEmpty } from 'fp-ts-std/URLSearchParams'
 *
 * assert.strictEqual(isEmpty(new URLSearchParams()), true)
 * assert.strictEqual(isEmpty(new URLSearchParams({ k: 'v' })), false)
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const isEmpty: Predicate<URLSearchParams> = u =>
	Array.from(u.keys()).length === 0

/**
 * Parse a `URLSearchParams` from a string.
 *
 * @example
 * import { fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const x = 'a=b&c=d'
 *
 * assert.deepStrictEqual(fromString(x), new URLSearchParams(x))
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const fromString: (x: string) => URLSearchParams = constructor

/**
 * Returns a query string suitable for use in a URL, absent a question mark.
 *
 * @example
 * import { toString } from 'fp-ts-std/URLSearchParams'
 *
 * const x = new URLSearchParams('a=b&c=d')
 *
 * assert.strictEqual(toString(x), 'a=b&c=d')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const toString = (x: URLSearchParams): string => x.toString()

/**
 * Like `toString`, but includes a leading question mark if the params are
 * non-empty.
 *
 * @example
 * import { toString, toLeadingString } from 'fp-ts-std/URLSearchParams'
 *
 * assert.strictEqual(toString(new URLSearchParams('')), '')
 * assert.strictEqual(toString(new URLSearchParams('a=b')), 'a=b')
 *
 * assert.strictEqual(toLeadingString(new URLSearchParams('')), '')
 * assert.strictEqual(toLeadingString(new URLSearchParams('a=b')), '?a=b')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const toLeadingString: (xs: URLSearchParams) => string = flow(
	toString,
	when(not(Str.isEmpty))(prepend("?")),
)

/**
 * Parse a `URLSearchParams` from an array of tuples.
 *
 * @example
 * import { fromTuples } from 'fp-ts-std/URLSearchParams'
 *
 * const x: Array<[string, string]> = [['a', 'b'], ['c', 'd']]
 *
 * assert.deepStrictEqual(fromTuples(x), new URLSearchParams(x))
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const fromTuples: (x: Array<[string, string]>) => URLSearchParams =
	constructor

/**
 * Construct a `URLSearchParams` from a single key/value pair.
 *
 * @example
 * import { singleton } from 'fp-ts-std/URLSearchParams'
 *
 * assert.deepStrictEqual(singleton('k')('v'), new URLSearchParams({ k: 'v' }))
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const singleton =
	(k: string) =>
	(v: string): URLSearchParams =>
		fromTuples([[k, v]])

/**
 * Losslessly convert a `URLSearchParams` to an array of tuples.
 *
 * @example
 * import { toTuples } from 'fp-ts-std/URLSearchParams'
 *
 * const x = new URLSearchParams('a=b&c=d&a=e')
 *
 * assert.deepStrictEqual(toTuples(x), [['a', 'b'], ['c', 'd'], ['a', 'e']])
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const toTuples = (x: URLSearchParams): Array<[string, string]> =>
	pipe(x.entries(), fromIterable)

/**
 * Parse a `URLSearchParams` from a record.
 *
 * @example
 * import { fromRecord } from 'fp-ts-std/URLSearchParams'
 *
 * const r = { a: ['b', 'c'], d: ['e'] }
 * const s = 'a=b&a=c&d=e'
 *
 * assert.deepStrictEqual(fromRecord(r), new URLSearchParams(s))
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const fromRecord: (x: Record<string, Array<string>>) => URLSearchParams =
	flow(
		R.foldMapWithIndex(Str.Ord)(A.getMonoid<[string, string]>())((k, vs) =>
			pipe(vs, A.map(withFst(k))),
		),
		fromTuples,
	)

/**
 * Convert a `URLSearchParams` to a record, grouping values by keys.
 *
 * @example
 * import { toRecord } from 'fp-ts-std/URLSearchParams'
 *
 * const x = new URLSearchParams('a=b&c=d&a=e')
 *
 * assert.deepStrictEqual(toRecord(x), { a: ['b', 'e'], c: ['d'] })
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const toRecord = (
	x: URLSearchParams,
): Record<string, NonEmptyArray<string>> =>
	R.fromFoldableMap(NEA.getSemigroup<string>(), A.Foldable)(
		toTuples(x),
		mapSnd(NEA.of),
	)

const EqValues = getDisorderedEq(Str.Ord)

/**
 * An `Eq` instance for `URLSearchParams` in which equivalence is determined
 * without respect to order.
 *
 * @example
 * import { Eq, fromString as f } from 'fp-ts-std/URLSearchParams'
 *
 * assert.strictEqual(Eq.equals(f('a=1&b=2&a=3'), f('b=2&a=3&a=1')), true)
 * assert.strictEqual(Eq.equals(f('a=1&b=2&a=3'), f('a=1&b=2')), false)
 *
 * @category 1 Typeclass Instances
 * @since 0.18.0
 */
export const Eq: Eq<URLSearchParams> = {
	equals: (xs, ys) => {
		if (size(xs) !== size(ys)) return false

		const ks = pipe(xs, keys, A.concat(keys(ys)), A.uniq(Str.Eq))
		for (const k of ks) {
			const mxvs = lookup(k)(xs)
			const myvs = lookup(k)(ys)

			if (O.isNone(mxvs) || O.isNone(myvs)) return false
			if (!EqValues.equals(mxvs.value, myvs.value)) return false
		}

		return true
	},
}

/**
 * Clone a `URLSearchParams`.
 *
 * @example
 * import { clone, fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const x = fromString('a=b&c=d')
 *
 * assert.strictEqual(x === clone(x), false)
 * assert.deepStrictEqual(x, clone(x))
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const clone: (x: URLSearchParams) => URLSearchParams = constructor

/**
 * Refine a foreign value to `URLSearchParams`.
 *
 * @example
 * import { isURLSearchParams, fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const x = fromString('a=b&c=d')
 *
 * assert.deepStrictEqual(isURLSearchParams(x), true)
 * assert.deepStrictEqual(isURLSearchParams({ not: { a: 'urlsearchparams' } }), false)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const isURLSearchParams: Refinement<unknown, URLSearchParams> =
	isInstanceOf(URLSearchParams)

/**
 * Attempt to get the first match for a URL parameter from a `URLSearchParams`.
 *
 * @example
 * import { lookupFirst, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d1&c=d2')
 *
 * assert.deepStrictEqual(lookupFirst('c')(x), O.some('d1'))
 * assert.deepStrictEqual(lookupFirst('e')(x), O.none)
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const lookupFirst = (
	k: string,
): ((ps: URLSearchParams) => Option<string>) =>
	flow(invoke("get")([k]), O.fromNullable)

/**
 * Attempt to get the first match for a URL parameter from a `URLSearchParams`.
 *
 * @example
 * import { getParam, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d1&c=d2')
 *
 * assert.deepStrictEqual(getParam('c')(x), O.some('d1'))
 * assert.deepStrictEqual(getParam('e')(x), O.none)
 *
 * @deprecated Prefer `lookupFirst`.
 * @category 5 Zone of Death
 * @since 0.1.0
 */
export const getParam: (k: string) => (ps: URLSearchParams) => Option<string> =
	lookupFirst

/**
 * Attempt to get all matches for a URL parameter from a `URLSearchParams`.
 *
 * @example
 * import { lookup, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d1&c=d2')
 *
 * assert.deepStrictEqual(lookup('a')(x), O.some(['b']))
 * assert.deepStrictEqual(lookup('c')(x), O.some(['d1', 'd2']))
 * assert.deepStrictEqual(lookup('e')(x), O.none)
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const lookup = (
	k: string,
): ((ps: URLSearchParams) => Option<NonEmptyArray<string>>) =>
	flow(invoke("getAll")([k]), NEA.fromArray)

/**
 * Attempt to get all matches for a URL parameter from a `URLSearchParams`.
 *
 * @example
 * import { getAllForParam, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d1&c=d2')
 *
 * assert.deepStrictEqual(getAllForParam('a')(x), O.some(['b']))
 * assert.deepStrictEqual(getAllForParam('c')(x), O.some(['d1', 'd2']))
 * assert.deepStrictEqual(getAllForParam('e')(x), O.none)
 *
 * @deprecated Prefer `lookup`.
 * @category 5 Zone of Death
 * @since 0.16.0
 */
export const getAllForParam: (
	k: string,
) => (ps: URLSearchParams) => Option<NonEmptyArray<string>> = lookup

/**
 * Insert or replace a URL parameter in a `URLSearchParams`.
 *
 * @example
 * import { upsertAt, lookupFirst, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d')
 * const y = upsertAt('c')('e')(x)
 *
 * const f = lookupFirst('c')
 *
 * assert.deepStrictEqual(f(x), O.some('d'))
 * assert.deepStrictEqual(f(y), O.some('e'))
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const upsertAt =
	(k: string) =>
	(v: string): Endomorphism<URLSearchParams> =>
	(x): URLSearchParams => {
		const y = clone(x)
		y.set(k, v)
		return y
	}

/**
 * Set a URL parameter in a `URLSearchParams`.
 *
 * @example
 * import { setParam, lookupFirst, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d')
 * const y = setParam('c')('e')(x)
 *
 * const f = lookupFirst('c')
 *
 * assert.deepStrictEqual(f(x), O.some('d'))
 * assert.deepStrictEqual(f(y), O.some('e'))
 *
 * @deprecated Prefer `upsertAt`.
 * @category 5 Zone of Death
 * @since 0.1.0
 */
export const setParam =
	(k: string) =>
	(v: string): Endomorphism<URLSearchParams> =>
	(x): URLSearchParams => {
		const y = clone(x)
		y.set(k, v)
		return y
	}

/**
 * Append a URL parameter in a `URLSearchParams`.
 *
 * @example
 * import { appendAt, lookup, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d')
 * const y = appendAt('c')('e')(x)
 *
 * const f = lookup('c')
 *
 * assert.deepStrictEqual(f(x), O.some(['d']))
 * assert.deepStrictEqual(f(y), O.some(['d', 'e']))
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const appendAt =
	(k: string) =>
	(v: string): Endomorphism<URLSearchParams> =>
	(x): URLSearchParams => {
		const y = clone(x)
		y.append(k, v)
		return y
	}

/**
 * Delete all URL parameters with the specified key.
 *
 * @example
 * import { deleteAt, lookup, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d&a=e')
 * const y = deleteAt('a')(x)
 *
 * const f = lookup('a')
 *
 * assert.deepStrictEqual(f(x), O.some(['b', 'e']))
 * assert.deepStrictEqual(f(y), O.none)
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const deleteAt =
	(k: string): Endomorphism<URLSearchParams> =>
	x => {
		const y = clone(x)
		y.delete(k)
		return y
	}

/**
 * Get an unsorted, potentially duplicative array of the keys in a
 * `URLSearchParams`.
 *
 * @example
 * import { keys, fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const x = fromString('a=b&c=d&a=e')
 *
 * assert.deepStrictEqual(keys(x), ['a', 'c', 'a'])
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const keys = (x: URLSearchParams): Array<string> =>
	fromIterable(x.keys())

/**
 * Get a flattened array of all the values in a `URLSearchParams`.
 *
 * @example
 * import { values, fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const x = fromString('a=b&c=d&a=e')
 *
 * assert.deepStrictEqual(values(x), ['b', 'd', 'e'])
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const values = (x: URLSearchParams): Array<string> =>
	fromIterable(x.values())

/**
 * Get the number of potentially duplicative key/value pairs in a
 * `URLSearchParams`.
 *
 * @example
 * import { size, fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const x = fromString('a=b&c=d&a=e')
 *
 * assert.strictEqual(size(x), 3)
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const size = (x: URLSearchParams): number => x.size

/**
 * Concat two `URLSearchParams` according to `f` in case of conflicts. The
 * `Array` in the return type of `f` encodes the possibility to set the key
 * once, multiple times, or not at all. Output order is unspecified.
 *
 * @example
 * import { concatBy, fromString, toString } from 'fp-ts-std/URLSearchParams'
 * import { fst } from 'fp-ts/Tuple'
 * import { constant } from 'fp-ts/function'
 *
 * const concatFirst = concatBy(constant(fst))
 *
 * const xs = fromString('a=1&b=2&a=3')
 * const ys = fromString('b=1&c=2')
 *
 * assert.deepStrictEqual(concatFirst(xs)(ys), fromString('a=1&a=3&b=2&c=2'))
 * assert.deepStrictEqual(concatFirst(ys)(xs), fromString('b=1&c=2&a=1&a=3'))
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const concatBy =
	(
		f: (
			k: string,
		) => (vs: [NonEmptyArray<string>, NonEmptyArray<string>]) => Array<string>,
	) =>
	(xs: URLSearchParams): Endomorphism<URLSearchParams> =>
	ys => {
		const zs = clone(empty)
		const ks = pipe(xs, keys, A.concat(keys(ys)), A.uniq(Str.Eq))

		for (const k of ks) {
			const xvs = xs.getAll(k)
			const yvs = ys.getAll(k)

			const zvs =
				A.isNonEmpty(xvs) && A.isNonEmpty(yvs)
					? f(k)([xvs, yvs])
					: A.concat(yvs)(xvs)

			for (const zv of zvs) zs.append(k, zv)
		}

		return zs
	}

/**
 * A `Semigroup` instance for `URLSearchParams` in which all key/value pairs
 * are preserved.
 *
 * @example
 * import { Semigroup, fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const xs = fromString("a=1&b=2&a=3")
 * const ys = fromString("b=4&c=5")
 *
 * const f = Semigroup.concat
 *
 * assert.deepStrictEqual(f(xs, ys), fromString("a=1&a=3&b=4&b=2&c=5"))
 * assert.deepStrictEqual(f(ys, xs), fromString("b=2&b=4&c=5&a=1&a=3"))
 *
 * @category 1 Typeclass Instances
 * @since 0.18.0
 */
export const Semigroup: SemigroupT<URLSearchParams> = {
	concat: (x, y) => concatBy(constant(uncurry2(A.concat)))(x)(y),
}

/**
 * A `Monoid` instance for `URLSearchParams` in which all key/value pairs are
 * preserved.
 *
 * @example
 * import { Monoid, empty } from 'fp-ts-std/URLSearchParams'
 *
 * assert.deepStrictEqual(Monoid.empty, empty)
 *
 * @category 1 Typeclass Instances
 * @since 0.18.0
 */
export const Monoid: Monoid<URLSearchParams> = {
	...Semigroup,
	empty,
}

/**
 * Convert a `Map` to a `URLSearchParams`.
 *
 * @example
 * import { fromMap, fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const m: Map<string, Array<string>> = new Map([ ['a', ['b', 'c']], ['d', ['e', 'f']] ])
 * const s = 'a=b&a=c&d=e&d=f'
 *
 * assert.deepStrictEqual(fromMap(m), fromString(s))
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const fromMap: (x: Map<string, Array<string>>) => URLSearchParams = flow(
	M.foldMapWithIndex(Str.Ord)(A.getMonoid<[string, string]>())((k, vs) =>
		pipe(vs, A.map(withFst(k))),
	),
	fromTuples,
)

/**
 * Convert a `URLSearchParams` to a `Map`, grouping values by keys.
 *
 * @example
 * import { toMap, fromString } from 'fp-ts-std/URLSearchParams'
 *
 * const u = fromString("a=1&b=3&a=2&b=4")
 * const m = new Map([ ['a', ['1', '2']], ['b', ['3', '4']] ])
 *
 * assert.deepStrictEqual(toMap(u), m)
 *
 * @category 3 Functions
 * @since 0.18.0
 */
// Defined like this as there's currently no `M.fromFoldableMap`.
export const toMap = (
	x: URLSearchParams,
): Map<string, NonEmptyArray<string>> => {
	const m = new Map<string, NonEmptyArray<string>>()

	for (const [k, v] of x.entries()) {
		const prev = M.lookup(Str.Eq)(k)(m)

		if (O.isSome(prev)) m.set(k, A.append(v)(prev.value))
		else m.set(k, NEA.of(v))
	}

	return m
}
