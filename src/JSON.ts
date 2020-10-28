/**
 * @since 0.1.0
 */

import { Newtype, iso } from 'newtype-ts';
import { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { flow, identity, pipe } from 'fp-ts/function';
import { isString } from './String';

/**
 * Newtype representing stringified JSON.
 *
 * @since 0.5.0
 */
export type JSONString = Newtype<{ readonly JSONString: unique symbol }, string>;

const { wrap: mkJSONString, unwrap: unJSONString } = iso<JSONString>();

/**
 * Stringify some arbitrary data.
 *
 * @since 0.1.0
 */
export const stringify = <E>(f: (e: TypeError) => E) => (x: unknown): Either<E, JSONString> => pipe(
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    E.stringifyJSON(x, (e) => f(e as TypeError)),
    E.filterOrElse(isString, () => f(new TypeError('Stringify output not a string'))),
    E.map(mkJSONString),
);

/**
 * Stringify some arbitrary data, returning an `Option`.
 *
 * @since 0.1.0
 */
export const stringifyO: (data: unknown) => Option<JSONString> =
    flow(stringify(identity), O.fromEither);

/**
 * Stringify a primitive value with no possibility of failure.
 *
 * @since 0.1.0
 */
export const stringifyPrimitive = (x: string | number | boolean | null): JSONString =>
    pipe(x, JSON.stringify, mkJSONString);

/**
 * Parse a string as JSON. This is safe provided there have been no shenanigans
 * with the `JSONString` newtype.
 *
 * @since 0.5.0
 */
export const unstringify: (x: JSONString) => unknown =
    flow(unJSONString, JSON.parse);

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

