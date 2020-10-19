/**
 * @since 0.2.0
 */

import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { pipe, Refinement } from 'fp-ts/function';

/**
 * An empty `URLSearchParams`.
 *
 * @since 0.2.0
 */
export const empty: URLSearchParams = new URLSearchParams();

/**
 * Parse a `URLSearchParams` from a string.
 *
 * @since 0.2.0
 */
export const fromString = (x: string): URLSearchParams => new URLSearchParams(x);

/**
 * Parse a `URLSearchParams` from a record.
 *
 * @since 0.2.0
 */
export const fromRecord = (x: Record<string, string>): URLSearchParams => new URLSearchParams(x);

/**
 * Parse a `URLSearchParams` from an array of tuples.
 *
 * @since 0.2.0
 */
export const fromTuples = (x: Array<[string, string]>): URLSearchParams => new URLSearchParams(x);

/**
 * Clone a `URLSearchParams`.
 *
 * @since 0.2.0
 */
export const clone = (x: URLSearchParams): URLSearchParams => new URLSearchParams(x);

/**
 * Refine a foreign value to `URLSearchParams`.
 *
 * @since 0.1.0
 */
export const isURLSearchParams: Refinement<unknown, URLSearchParams> = (x): x is URLSearchParams =>
    x instanceof URLSearchParams;

/**
 * Attempt to get a URL parameter from a `URLSearchParams`.
 *
 * @since 0.1.0
 */
export const getParam = (k: string) => (ps: URLSearchParams): Option<string> => pipe(
    ps.get(k),
    O.fromNullable,
);

/**
 * Set a URL parameter in a `URLSearchParams`. This does not mutate the input.
 *
 * @since 0.1.0
 */
export const setParam = (k: string) => (v: string) => (x: URLSearchParams): URLSearchParams => {
    const y = new URLSearchParams(x);
    y.set(k, v); // eslint-disable-line functional/no-expression-statement
    return y;
};

