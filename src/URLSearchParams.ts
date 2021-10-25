/**
 * Various functions to aid in working with JavaScript's `URLSearchParams`
 * interface.
 *
 * @since 0.2.0
 */

import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { flow, pipe } from "fp-ts/function"
import { Refinement } from "fp-ts/Refinement"
import { construct, invoke, is } from "./Function"

/**
 * An empty `URLSearchParams`.
 *
 * @example
 * import { empty } from 'fp-ts-std/URLSearchParams';
 *
 * assert.deepStrictEqual(empty, new URLSearchParams());
 *
 * @since 0.2.0
 */
export const empty: URLSearchParams = construct(URLSearchParams)([])

/**
 * Parse a `URLSearchParams` from a string.
 *
 * @example
 * import { fromString } from 'fp-ts-std/URLSearchParams';
 *
 * const x = 'a=b&c=d';
 *
 * assert.deepStrictEqual(fromString(x), new URLSearchParams(x));
 *
 * @since 0.2.0
 */
export const fromString = (x: string): URLSearchParams =>
  pipe([x], construct(URLSearchParams))

/**
 * Parse a `URLSearchParams` from a record.
 *
 * @example
 * import { fromRecord } from 'fp-ts-std/URLSearchParams';
 *
 * const x = { a: 'b', c: 'd' };
 *
 * assert.deepStrictEqual(fromRecord(x), new URLSearchParams(x));
 *
 * @since 0.2.0
 */
export const fromRecord = (x: Record<string, string>): URLSearchParams =>
  pipe([x], construct(URLSearchParams))

/**
 * Parse a `URLSearchParams` from an array of tuples.
 *
 * @example
 * import { fromTuples } from 'fp-ts-std/URLSearchParams';
 *
 * const x: Array<[string, string]> = [['a', 'b'], ['c', 'd']];
 *
 * assert.deepStrictEqual(fromTuples(x), new URLSearchParams(x));
 *
 * @since 0.2.0
 */
export const fromTuples = (x: Array<[string, string]>): URLSearchParams =>
  pipe([x], construct(URLSearchParams))

/**
 * Clone a `URLSearchParams`.
 *
 * @example
 * import { clone, fromString } from 'fp-ts-std/URLSearchParams';
 *
 * const x = fromString('a=b&c=d');
 *
 * assert.strictEqual(x === clone(x), false);
 * assert.deepStrictEqual(x, clone(x));
 *
 * @since 0.2.0
 */
export const clone = (x: URLSearchParams): URLSearchParams =>
  pipe([x], construct(URLSearchParams))

/**
 * Refine a foreign value to `URLSearchParams`.
 *
 * @example
 * import { isURLSearchParams, fromString } from 'fp-ts-std/URLSearchParams';
 *
 * const x = fromString('a=b&c=d');
 *
 * assert.deepStrictEqual(isURLSearchParams(x), true);
 * assert.deepStrictEqual(isURLSearchParams({ not: { a: 'urlsearchparams' } }), false);
 *
 * @since 0.1.0
 */
export const isURLSearchParams: Refinement<unknown, URLSearchParams> =
  is(URLSearchParams)

/**
 * Attempt to get a URL parameter from a `URLSearchParams`.
 *
 * @example
 * import { getParam, fromString } from 'fp-ts-std/URLSearchParams';
 * import * as O from 'fp-ts/Option';
 *
 * const x = fromString('a=b&c=d');
 *
 * assert.deepStrictEqual(getParam('c')(x), O.some('d'));
 * assert.deepStrictEqual(getParam('e')(x), O.none);
 *
 * @since 0.1.0
 */
export const getParam = (
  k: string,
): ((ps: URLSearchParams) => Option<string>) =>
  flow(invoke("get")([k]), O.fromNullable)

/**
 * Set a URL parameter in a `URLSearchParams`. This does not mutate the input.
 *
 * @example
 * import { setParam, getParam, fromString } from 'fp-ts-std/URLSearchParams';
 * import * as O from 'fp-ts/Option';
 *
 * const x = fromString('a=b&c=d');
 * const y = setParam('c')('e')(x);
 *
 * const f = getParam('c');
 *
 * assert.deepStrictEqual(f(x), O.some('d'));
 * assert.deepStrictEqual(f(y), O.some('e'));
 *
 * @since 0.1.0
 */
export const setParam =
  (k: string) =>
  (v: string) =>
  (x: URLSearchParams): URLSearchParams => {
    const y = clone(x)
    y.set(k, v) // eslint-disable-line functional/no-expression-statement
    return y
  }
