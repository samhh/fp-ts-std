/**
 * @since 0.1.0
 */

import { Endomorphism, not, Predicate } from "fp-ts/function"
import { Option } from "fp-ts/Option"
import * as R from "fp-ts/Record"

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
export const values = <A>(x: Record<string, A>): Array<A> => Object.values(x)

/**
 * Like `lookup` from fp-ts, but flipped.
 *
 * @example
 * import { lookupFlipped } from 'fp-ts-std/Record';
 * import * as A from 'fp-ts/Array';
 *
 * const x = { a: 1, b: 'two', c: [true] };
 * const ks = ['a', 'c'];
 *
 * assert.deepStrictEqual(A.filterMap(lookupFlipped(x))(ks), [1, [true]]);
 *
 * @since 0.1.0
 */
export const lookupFlipped = <A>(x: Record<string, A>) => (
  k: string,
): Option<A> => R.lookup(k)(x)

/**
 * Pick a set of keys from a `Record`. The value-level equivalent of the `Pick`
 * type.
 *
 * @example
 * import { pick } from 'fp-ts-std/Record';
 *
 * type MyType = { a: number; b: string; c: Array<boolean> };
 * const picked = pick<MyType>()(['a', 'c']);
 *
 * assert.deepStrictEqual(picked({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] });
 *
 * @since 0.1.0
 */
export const pick = <A>() => <K extends keyof A>(ks: Array<K>) => (
  x: A,
): Pick<A, K> => {
  // I don't believe there's any reasonable way to model this sort of
  // transformation in the type system without an assertion - at least here
  // it's in a single reused place
  const o = {} as Pick<A, K>

  /* eslint-disable */
  for (const k of ks) {
    o[k] = x[k]
  }
  /* eslint-enable */

  return o
}

/**
 * Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
 * type.
 *
 * @example
 * import { omit } from 'fp-ts-std/Record';
 *
 * const sansB = omit(['b']);
 *
 * assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] });
 *
 * @since 0.1.0
 */
export const omit = <K extends string>(ks: Array<K>) => <
  V,
  A extends Record<K, V>
>(
  x: Partial<A>,
): Omit<A, K> => {
  const y = { ...x }

  /* eslint-disable */
  for (const k of ks) {
    delete y[k]
  }
  /* eslint-enable */

  return y as Omit<A, K>
}

/**
 * Filters out key/value pairs in the record for which the predicate upon the
 * value holds. This can be thought of as the inverse of ordinary record
 * filtering.
 *
 * @example
 * import { reject } from 'fp-ts-std/Record';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 *
 * assert.deepStrictEqual(reject(isEven)({ a: 1, b: 2, c: 3, d: 4 }), { a: 1, c: 3 });
 *
 * @since 0.7.0
 */
export const reject = <A>(f: Predicate<A>): Endomorphism<Record<string, A>> =>
  R.filter(not(f))

/**
 * Merge two records together. For merging many identical records, instead
 * consider defining a semigroup.
 *
 * @example
 * import { merge } from 'fp-ts-std/Record';
 *
 * assert.deepStrictEqual(merge({ a: 1, b: 2 })({ b: 'two', c: true }), { a: 1, b: 'two', c: true });
 *
 * @since 0.7.0
 */
export const merge = <A>(x: A) => <B>(y: B): A & B => ({ ...x, ...y })
