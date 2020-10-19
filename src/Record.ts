/**
 * @since 0.1.0
 */

import { Option } from 'fp-ts/Option';
import * as R from 'fp-ts/Record';

/**
 * `Object.keys` returns `string[]` because TypeScript's type system is
 * structural / non-exact. This function is technically unsafe for this reason,
 * but if used with caution can be helpful for obtaining that same array
 * without the key type being widened.
 *
 * @since 0.1.0
 */
export const unsafeExactKeys = <A extends string, B>(x: Record<A, B>): A[] =>
    Object.keys(x) as A[];

/**
 * Get the values from a `Record`.
 *
 * @since 0.1.0
 */
export const values = <A>(x: Record<string, A>): Array<A> => Object.values(x);

/**
 * Like `lookup` from fp-ts, but flipped.
 *
 * @since 0.1.0
 */
export const lookupFlipped = <A>(x: Record<string, A>) => (k: string): Option<A> =>
    R.lookup(k)(x);

/**
 * Pick a set of keys from a `Record`. The value-level equivalent of the `Pick`
 * type.
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
 * @since 0.1.0
 */
export const omit = <K extends string>(ks: K[]) => <V, A extends Record<K, V>>(x: A): Omit<A, K> => {
    const y = { ...x };

    /* eslint-disable */
    for (const k of ks) {
        delete y[k];
    }
    /* eslint-enable */

    return y as Omit<A, K>;
};

