/*
 * This module targets readonly objects in the sense of maps. For readonly
 * objects in the sense of product types see the `ReadonlyStruct` module.
 *
 * @since 0.10.0
 */

import { flow } from "fp-ts/lib/function.js"
import { Predicate, not } from "fp-ts/lib/Predicate.js"
import { Option } from "fp-ts/lib/Option.js"
import * as RR from "fp-ts/lib/ReadonlyRecord.js"
import * as RA from "fp-ts/lib/ReadonlyArray.js"
import * as RT from "fp-ts/lib/ReadonlyTuple.js"
import { last } from "fp-ts/lib/Semigroup.js"
import { elemV } from "./ReadonlyArray.js"
import * as Str from "fp-ts/lib/string.js"

/**
 * Get the values from a `Record`.
 *
 * @example
 * import { values } from 'fp-ts-std/ReadonlyRecord'
 *
 * const x = { a: 1, b: 'two' }
 *
 * assert.deepStrictEqual(values(x), [1, 'two'])
 *
 * @category 3 Functions
 * @since 0.10.0
 */
export const values: <A>(x: RR.ReadonlyRecord<string, A>) => ReadonlyArray<A> =
  Object.values

/**
 * Like `fp-ts/ReadonlyRecord::lookup` but flipped, which the "V" suffix
 * denotes.
 *
 * @example
 * import { lookupV } from 'fp-ts-std/ReadonlyRecord'
 * import * as A from 'fp-ts/Array'
 *
 * const x = { a: 1, b: 'two', c: [true] }
 * const ks = ['a', 'c']
 *
 * assert.deepStrictEqual(A.filterMap(lookupV(x))(ks), [1, [true]])
 *
 * @category 3 Functions
 * @since 0.10.0
 */
export const lookupV =
  <A>(x: RR.ReadonlyRecord<string, A>) =>
  (k: string): Option<A> =>
    RR.lookup(k)(x)

/**
 * Filters out key/value pairs in the record for which the predicate upon the
 * value holds. This can be thought of as the inverse of ordinary record
 * filtering.
 *
 * @example
 * import { reject } from 'fp-ts-std/ReadonlyRecord'
 * import { Predicate } from 'fp-ts/Predicate'
 *
 * const isEven: Predicate<number> = n => n % 2 === 0
 *
 * assert.deepStrictEqual(reject(isEven)({ a: 1, b: 2, c: 3, d: 4 }), { a: 1, c: 3 })
 *
 * @category 3 Functions
 * @since 0.10.0
 */
export const reject = <A>(
  f: Predicate<A>,
): (<B extends A>(
  x: RR.ReadonlyRecord<string, B>,
) => RR.ReadonlyRecord<string, B>) => RR.filter(not(f))

/**
 * Invert a record, keeping only the last value should the same key be
 * encountered more than once. If you'd like to keep the values that would be
 * lost, see instead `invertAll`.
 *
 * @example
 * import { invertLast } from 'fp-ts-std/ReadonlyRecord'
 * import { fromNumber } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(invertLast(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': 'a', '2': 'c', '3': 'd' })
 *
 * @category 3 Functions
 * @since 0.10.0
 */
export const invertLast = <A>(
  f: (x: A) => string,
): ((x: RR.ReadonlyRecord<string, A>) => RR.ReadonlyRecord<string, string>) =>
  flow(
    RR.toReadonlyArray,
    RA.map(flow(RT.mapSnd(f), RT.swap)),
    RR.fromFoldable(last<string>(), RA.Foldable),
  )

/**
 * Invert a record, collecting values with duplicate keys in an array. Should
 * you only care about the last item or are not worried about the risk of
 * duplicate keys, see instead `invertLast`.
 *
 * @example
 * import { invertAll } from 'fp-ts-std/ReadonlyRecord'
 * import { fromNumber } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(invertAll(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': ['a'], '2': ['b', 'c'], '3': ['d'] })
 *
 * @category 3 Functions
 * @since 0.10.0
 */
export const invertAll = <A>(
  f: (x: A) => string,
): ((
  x: RR.ReadonlyRecord<string, A>,
) => RR.ReadonlyRecord<string, ReadonlyArray<string>>) =>
  flow(
    RR.toReadonlyArray,
    RA.map(flow(RT.bimap(f, RA.of), RT.swap)),
    RR.fromFoldable(RA.getMonoid<string>(), RA.Foldable),
  )

/**
 * Pick a set of keys from a `ReadonlyRecord`. The value-level equivalent of
 * the `Pick` type. For picking records with typed keys, instead look at the
 * `ReadonlyStruct` module.
 *
 * @example
 * import { pick } from 'fp-ts-std/ReadonlyRecord'
 * import { pipe } from 'fp-ts/function'
 *
 * const picked = pipe(
 *   { a: 1, b: 'two', c: [true] },
 *   pick(['a', 'c'])
 * )
 *
 * assert.deepStrictEqual(picked, { a: 1, c: [true] })
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const pick = (
  ks: ReadonlyArray<string>,
): (<A>(y: RR.ReadonlyRecord<string, A>) => RR.ReadonlyRecord<string, A>) =>
  RR.filterWithIndex(elemV(Str.Eq)(ks))

/**
 * Omit a set of keys from a `ReadonlyRecord`. The value-level equivalent of
 * the `Omit` type. For omitting from records with typed keys, instead look at
 * the `ReadonlyStruct` module.
 *
 * @example
 * import { omit } from 'fp-ts-std/ReadonlyRecord'
 * import { pipe } from 'fp-ts/function'
 *
 * const remaining = pipe(
 *   { a: 1, b: 'two', c: [true] },
 *   omit(['b'])
 * )
 *
 * assert.deepStrictEqual(remaining, { a: 1, c: [true] })
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const omit = (
  ks: Array<string>,
): (<A>(y: Record<string, A>) => Record<string, A>) =>
  RR.filterWithIndex(not(elemV(Str.Eq)(ks)))
