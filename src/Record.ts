/**
 * @since 0.1.0
 */

import { Option } from 'fp-ts/Option';
import * as R from 'fp-ts/Record';

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
export const values = <A>(x: Record<string, A>): Array<A> => Object.values(x);

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
export const lookupFlipped = <A>(x: Record<string, A>) => (k: string): Option<A> =>
    R.lookup(k)(x);

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
export const pick = <A>() => <K extends keyof A>(ks: K[]) => (x: A): Pick<A, K> => {
    // I don't believe there's any reasonable way to model this sort of
    // transformation in the type system without an assertion - at least here
    // it's in a single reused place
    const o = {} as Pick<A, K>;

    /* eslint-disable */
    for (const k of ks) {
        o[k] = x[k];
    }
    /* eslint-enable */

    return o;
};

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
export const omit = <K extends string>(ks: K[]) => <V, A extends Record<K, V>>(x: Partial<A>): Omit<A, K> => {
    const y = { ...x };

    /* eslint-disable */
    for (const k of ks) {
        delete y[k];
    }
    /* eslint-enable */

    return y as Omit<A, K>;
};

