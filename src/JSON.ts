/**
 * @since 0.1.0
 */

import { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { flow, identity } from 'fp-ts/function';

/**
 * Stringify some arbitrary data.
 *
 * @since 0.1.0
 */
export const stringify = <E>(f: (e: TypeError) => E) => (x: unknown): Either<E, string> =>
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    E.stringifyJSON(x, (e) => f(e as TypeError));

/**
 * Stringify some arbitrary data, returning an `Option`.
 *
 * @since 0.1.0
 */
export const stringifyO: (data: unknown) => Option<string> =
    flow(stringify(identity), O.fromEither);

/**
 * Stringify a primitive value with no possibility of failure.
 *
 * @since 0.1.0
 */
export const stringifyPrimitive = (x: string | number | boolean | null | undefined): string =>
    JSON.stringify(x);

/**
 * Parse a string as JSON.
 *
 * @since 0.1.0
 */
export const parse = <E>(f: (e: SyntaxError) => E) => (x: string): Either<E, unknown> =>
    // It should only throw some sort of `SyntaxError`:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    E.parseJSON(x, (e) => f(e as SyntaxError));

/**
 * Parse a string as JSON, returning an `Option`.
 *
 * @since 0.1.0
 */
export const parseO: (stringified: string) => Option<unknown> =
    flow(parse(identity), O.fromEither);

