/**
 * This module targets objects in the sense of maps. For objects in the sense
 * of product types see the `Struct` module.
 *
 * @since 0.1.0
 */

import { flow } from "fp-ts/function"
import { Predicate, not } from "fp-ts/Predicate"
import { Option } from "fp-ts/Option"
import * as R from "fp-ts/Record"
import * as A from "fp-ts/Array"
import * as T from "fp-ts/Tuple"
import { last } from "fp-ts/Semigroup"

/**
 * Get the values from a `Record`.
 *
 * @example
 * import { values } from 'fp-ts-std/Record';
 *
 * const x = { a: 1, b: 'two' };
 *
 * assert.deepStrictEqual(values(x), [1, 'two']);
 *
 * @since 0.1.0
 */
export const values: <A>(x: Record<string, A>) => Array<A> = Object.values

/**
 * Like `fp-ts/Record::lookup` but flipped, which the "V" suffix denotes.
 *
 * @example
 * import { lookupV } from 'fp-ts-std/Record';
 * import * as A from 'fp-ts/Array';
 *
 * const x = { a: 1, b: 'two', c: [true] };
 * const ks = ['a', 'c'];
 *
 * assert.deepStrictEqual(A.filterMap(lookupV(x))(ks), [1, [true]]);
 *
 * @since 0.1.0
 */
export const lookupV =
  <A>(x: Record<string, A>) =>
  (k: string): Option<A> =>
    R.lookup(k)(x)

/**
 * Filters out key/value pairs in the record for which the predicate upon the
 * value holds. This can be thought of as the inverse of ordinary record
 * filtering.
 *
 * @example
 * import { reject } from 'fp-ts-std/Record';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 *
 * assert.deepStrictEqual(reject(isEven)({ a: 1, b: 2, c: 3, d: 4 }), { a: 1, c: 3 });
 *
 * @since 0.7.0
 */
export const reject = <A>(
  f: Predicate<A>,
): (<B extends A>(x: Record<string, B>) => Record<string, B>) =>
  R.filter(not(f))

/**
 * Invert a record, keeping only the last value should the same key be
 * encountered more than once. If you'd like to keep the values that would be
 * lost, see instead `invertAll`.
 *
 * @example
 * import { invertLast } from 'fp-ts-std/Record';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(invertLast(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': 'a', '2': 'c', '3': 'd' });
 *
 * @since 0.7.0
 */
export const invertLast = <A>(
  f: (x: A) => string,
): ((x: Record<string, A>) => Record<string, string>) =>
  flow(
    R.toArray,
    A.map(flow(T.mapSnd(f), T.swap)),
    R.fromFoldable(last<string>(), A.Foldable),
  )

/**
 * Invert a record, collecting values with duplicate keys in an array. Should
 * you only care about the last item or are not worried about the risk of
 * duplicate keys, see instead `invertLast`.
 *
 * @example
 * import { invertAll } from 'fp-ts-std/Record';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(invertAll(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': ['a'], '2': ['b', 'c'], '3': ['d'] });
 *
 * @since 0.7.0
 */
export const invertAll = <A>(
  f: (x: A) => string,
): ((x: Record<string, A>) => Record<string, Array<string>>) =>
  flow(
    R.toArray,
    A.map(flow(T.bimap(f, A.of), T.swap)),
    R.fromFoldable(A.getMonoid<string>(), A.Foldable),
  )
