/**
 * @since 0.1.0
 */

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

