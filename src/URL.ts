/**
 * Various functions to aid in working with JavaScript's `URL` interface.
 *
 * @since 0.1.0
 */

import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"
import { flow, identity, pipe, Refinement } from "fp-ts/function"

/**
 * Unsafely parse a `URL`, throwing on failure.
 *
 * @example
 * import { unsafeParse } from 'fp-ts-std/URL';
 *
 * assert.deepStrictEqual(unsafeParse('https://samhh.com'), new URL('https://samhh.com'));
 *
 * @since 0.1.0
 */
export const unsafeParse = (x: string): URL => new URL(x)

/**
 * Safely parse a `URL`.
 *
 * @example
 * import { parse } from 'fp-ts-std/URL';
 * import * as E from 'fp-ts/Either';
 * import { constant } from 'fp-ts/function';
 *
 * const f = parse(constant('e'));
 *
 * assert.deepStrictEqual(f('https://samhh.com'), E.right(new URL('https://samhh.com')));
 * assert.deepStrictEqual(f('invalid'), E.left('e'));
 *
 * @since 0.1.0
 */
export const parse = <E>(f: (e: TypeError) => E) => (
  x: string,
): Either<E, URL> =>
  pipe(
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    E.tryCatch(
      () => unsafeParse(x),
      e => f(e as TypeError),
    ),
  )

/**
 * Safely parse a `URL`, returning an `Option`.
 *
 * @example
 * import { parseO } from 'fp-ts-std/URL';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(parseO('https://samhh.com'), O.some(new URL('https://samhh.com')));
 * assert.deepStrictEqual(parseO('invalid'), O.none);
 *
 * @since 0.1.0
 */
export const parseO: (href: string) => Option<URL> = flow(
  parse(identity),
  O.fromEither,
)

/**
 * Refine a foreign value to `URL`.
 *
 * @example
 * import { isURL } from 'fp-ts-std/URL';
 *
 * assert.strictEqual(isURL(new URL('https://samhh.com')), true);
 * assert.strictEqual(isURL({ not: { a: 'url' } }), false);
 *
 * @since 0.1.0
 */
export const isURL: Refinement<unknown, URL> = (x): x is URL => x instanceof URL
