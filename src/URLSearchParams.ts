/**
 * Various functions to aid in working with JavaScript's `URLSearchParams`
 * interface.
 *
 * @since 0.2.0
 */

import { Option } from "fp-ts/lib/Option.js"
import * as O from "fp-ts/lib/Option.js"
import * as R from "fp-ts/lib/Record.js"
import { flow, pipe } from "fp-ts/lib/function.js"
import { Refinement } from "fp-ts/lib/Refinement.js"
import { construct, invoke, isInstanceOf } from "./Function.js"
import { Predicate } from "fp-ts/lib/Predicate.js"
import * as NEA from "fp-ts/lib/NonEmptyArray.js"
import NonEmptyArray = NEA.NonEmptyArray
import * as A from "fp-ts/lib/Array.js"
import { fromIterable } from "./Array.js"
import { mapSnd } from "fp-ts/lib/Tuple.js"
import * as Str from "fp-ts/lib/string.js"
import { withFst } from "./Tuple.js"
import { Endomorphism } from "fp-ts/lib/Endomorphism.js"

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
export const empty: URLSearchParams = construct(URLSearchParams)([])

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
export const fromString = (x: string): URLSearchParams =>
  pipe([x], construct(URLSearchParams))

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
export const fromTuples = (x: Array<[string, string]>): URLSearchParams =>
  pipe([x], construct(URLSearchParams))

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
export const clone = (x: URLSearchParams): URLSearchParams =>
  pipe([x], construct(URLSearchParams))

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
 * import { getParam, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d1&c=d2')
 *
 * assert.deepStrictEqual(getParam('c')(x), O.some('d1'))
 * assert.deepStrictEqual(getParam('e')(x), O.none)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const getParam = (
  k: string,
): ((ps: URLSearchParams) => Option<string>) =>
  flow(invoke("get")([k]), O.fromNullable)

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
 * @category 3 Functions
 * @since 0.16.0
 */
export const getAllForParam = (
  k: string,
): ((ps: URLSearchParams) => Option<NonEmptyArray<string>>) =>
  flow(invoke("getAll")([k]), NEA.fromArray)

/**
 * Set a URL parameter in a `URLSearchParams`. This does not mutate the input.
 *
 * @example
 * import { setParam, getParam, fromString } from 'fp-ts-std/URLSearchParams'
 * import * as O from 'fp-ts/Option'
 *
 * const x = fromString('a=b&c=d')
 * const y = setParam('c')('e')(x)
 *
 * const f = getParam('c')
 *
 * assert.deepStrictEqual(f(x), O.some('d'))
 * assert.deepStrictEqual(f(y), O.some('e'))
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const setParam =
  (k: string) =>
  (v: string): Endomorphism<URLSearchParams> =>
  (x): URLSearchParams => {
    const y = clone(x)
    y.set(k, v) // eslint-disable-line functional/no-expression-statements
    return y
  }
