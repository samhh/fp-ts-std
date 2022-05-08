/*
 * This module targets readonly objects in the sense of maps. For readonly
 * objects in the sense of product types see the `ReadonlyStruct` module.
 *
 * @since 0.10.0
 */

import { flow } from "fp-ts/function"
import { Predicate, not } from "fp-ts/Predicate"
import { Endomorphism } from "fp-ts/Endomorphism"
import { Option } from "fp-ts/Option"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RA from "fp-ts/ReadonlyArray"
import * as RT from "fp-ts/ReadonlyTuple"
import { last } from "fp-ts/Semigroup"

/**
 * Get the values from a `Record`.
 *
 * @example
 * import { values } from 'fp-ts-std/ReadonlyRecord';
 *
 * const x = { a: 1, b: 'two' };
 *
 * assert.deepStrictEqual(values(x), [1, 'two']);
 *
 * @since 0.10.0
 */
export const values: <A>(x: RR.ReadonlyRecord<string, A>) => ReadonlyArray<A> =
  Object.values

/**
 * Like `fp-ts/ReadonlyRecord::lookup` but flipped, which the "V" suffix
 * denotes.
 *
 * @example
 * import { lookupV } from 'fp-ts-std/ReadonlyRecord';
 * import * as A from 'fp-ts/Array';
 *
 * const x = { a: 1, b: 'two', c: [true] };
 * const ks = ['a', 'c'];
 *
 * assert.deepStrictEqual(A.filterMap(lookupV(x))(ks), [1, [true]]);
 *
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
 * import { reject } from 'fp-ts-std/ReadonlyRecord';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 *
 * assert.deepStrictEqual(reject(isEven)({ a: 1, b: 2, c: 3, d: 4 }), { a: 1, c: 3 });
 *
 * @since 0.10.0
 */
export const reject = <A>(
  f: Predicate<A>,
): Endomorphism<RR.ReadonlyRecord<string, A>> => RR.filter(not(f))

/**
 * Invert a record, keeping only the last value should the same key be
 * encountered more than once. If you'd like to keep the values that would be
 * lost, see instead `invertAll`.
 *
 * @example
 * import { invertLast } from 'fp-ts-std/ReadonlyRecord';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(invertLast(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': 'a', '2': 'c', '3': 'd' });
 *
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
 * import { invertAll } from 'fp-ts-std/ReadonlyRecord';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(invertAll(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': ['a'], '2': ['b', 'c'], '3': ['d'] });
 *
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
