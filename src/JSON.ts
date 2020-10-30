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

const isoJSONString = iso<JSONString>();

const mkJSONString = isoJSONString.wrap;

/**
 * Unwrap a `JSONString` newtype back to its underlying string representation.
 *
 * @since 0.6.0
 */
export const unJSONString = isoJSONString.unwrap;

/**
 * Stringify some arbitrary data.
 *
 * @example
 * import { stringify } from 'fp-ts-std/JSON';
 * import * as E from 'fp-ts/Either';
 * import { constant } from 'fp-ts/function';
 *
 * const f = stringify(constant('e'));
 *
 * const valid = 'abc';
 * const invalid = () => {};
 *
 * assert.deepStrictEqual(f(valid), E.right('"abc"'));
 * assert.deepStrictEqual(f(invalid), E.left('e'));
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
 * @example
 * import { stringifyO } from 'fp-ts-std/JSON';
 * import * as O from 'fp-ts/Option';
 *
 * const valid = 'abc';
 * const invalid = () => {};
 *
 * assert.deepStrictEqual(stringifyO(valid), O.some('"abc"'));
 * assert.deepStrictEqual(stringifyO(invalid), O.none);
 *
 * @since 0.1.0
 */
export const stringifyO: (data: unknown) => Option<JSONString> =
    flow(stringify(identity), O.fromEither);

/**
 * Stringify a primitive value with no possibility of failure.
 *
 * @example
 * import { stringifyPrimitive } from 'fp-ts-std/JSON';
 *
 * assert.strictEqual(stringifyPrimitive('abc'), '"abc"');
 *
 * @since 0.1.0
 */
export const stringifyPrimitive = (x: string | number | boolean | null): JSONString =>
    pipe(x, JSON.stringify, mkJSONString);

/**
 * Parse a string as JSON. This is safe provided there have been no shenanigans
 * with the `JSONString` newtype.
 *
 * @example
 * import { unstringify, stringifyPrimitive } from 'fp-ts-std/JSON';
 * import { flow } from 'fp-ts/function';
 *
 * const f = flow(stringifyPrimitive, unstringify);
 *
 * assert.strictEqual(f('abc'), 'abc');
 *
 * @since 0.5.0
 */
export const unstringify: (x: JSONString) => unknown =
    flow(unJSONString, JSON.parse);

/**
 * Parse a string as JSON.
 *
 * @example
 * import { parse } from 'fp-ts-std/JSON';
 * import * as E from 'fp-ts/Either';
 * import { constant } from 'fp-ts/function';
 *
 * const f = parse(constant('e'));
 *
 * const valid = '"abc"';
 * const invalid = 'abc';
 *
 * assert.deepStrictEqual(f(valid), E.right('abc'));
 * assert.deepStrictEqual(f(invalid), E.left('e'));
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
 * @example
 * import { parseO } from 'fp-ts-std/JSON';
 * import * as O from 'fp-ts/Option';
 *
 * const valid = '"abc"';
 * const invalid = 'abc';
 *
 * assert.deepStrictEqual(parseO(valid), O.some('abc'));
 * assert.deepStrictEqual(parseO(invalid), O.none);
 *
 * @since 0.1.0
 */
export const parseO: (stringified: string) => Option<unknown> =
    flow(parse(identity), O.fromEither);

