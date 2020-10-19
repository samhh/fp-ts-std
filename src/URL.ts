/**
 * @since 0.1.0
 */

import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';
import { flow, identity, pipe, Refinement } from 'fp-ts/function';

/**
 * Unsafely parse a `URL`, throwing on failure.
 *
 * @since 0.1.0
 */
export const unsafeParse = (x: string): URL => new URL(x);

/**
 * Safely parse a `URL`.
 *
 * @since 0.1.0
 */
export const parse = <E>(f: (e: TypeError) => E) => (x: string): Either<E, URL> => pipe(
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    E.tryCatch(() => unsafeParse(x), (e) => f(e as TypeError)),
);

/**
 * Safely parse a `URL`, returning an `Option`.
 *
 * @since 0.1.0
 */
export const parseO = flow(parse(identity), O.fromEither);

/**
 * Refine a foreign value to `URL`.
 *
 * @since 0.1.0
 */
export const isURL: Refinement<unknown, URL> = (x): x is URL => x instanceof URL;

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

