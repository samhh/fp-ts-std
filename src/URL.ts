/**
 * Various functions to aid in working with JavaScript's `URL` interface.
 *
 * @since 0.1.0
 */

import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"
import { flow, identity } from "fp-ts/function"
import { Refinement } from "fp-ts/Refinement"
import { isInstanceOf } from "./Function"
import { Endomorphism } from "fp-ts/Endomorphism"

const constructor = (x: ConstructorParameters<typeof URL>[0]): URL => new URL(x)

/**
 * Clone a `URL` object.
 *
 * @example
 * import { clone } from 'fp-ts-std/URL'
 *
 * const x = new URL('https://samhh.com/foo')
 * const y = clone(x)
 *
 * x.pathname = '/bar'
 *
 * assert.strictEqual(x.pathname, '/bar')
 * assert.strictEqual(y.pathname, '/foo')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const clone: Endomorphism<URL> = constructor

/**
 * Unsafely parse a `URL`, throwing on failure.
 *
 * @example
 * import { unsafeParse } from 'fp-ts-std/URL'
 *
 * assert.deepStrictEqual(unsafeParse('https://samhh.com'), new URL('https://samhh.com'))
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const unsafeParse: (x: string) => URL = constructor

/**
 * Safely parse a `URL`.
 *
 * @example
 * import { parse } from 'fp-ts-std/URL'
 * import * as E from 'fp-ts/Either'
 * import { constant } from 'fp-ts/function'
 *
 * const f = parse(constant('e'))
 *
 * assert.deepStrictEqual(f('https://samhh.com'), E.right(new URL('https://samhh.com')))
 * assert.deepStrictEqual(f('invalid'), E.left('e'))
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const parse =
  <E>(f: (e: TypeError) => E) =>
  (x: string): Either<E, URL> =>
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    E.tryCatch(
      () => unsafeParse(x),
      e => f(e as TypeError),
    )

/**
 * Safely parse a `URL`, returning an `Option`.
 *
 * @example
 * import { parseO } from 'fp-ts-std/URL'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(parseO('https://samhh.com'), O.some(new URL('https://samhh.com')))
 * assert.deepStrictEqual(parseO('invalid'), O.none)
 *
 * @category 3 Functions
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
 * import { isURL } from 'fp-ts-std/URL'
 *
 * assert.strictEqual(isURL(new URL('https://samhh.com')), true)
 * assert.strictEqual(isURL({ not: { a: 'url' } }), false)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const isURL: Refinement<unknown, URL> = isInstanceOf(URL)

/**
 * Build a string from every piece of a `URL`. Includes a trailing `/` when the
 * pathname is empty.
 *
 * @example
 * import { toString } from 'fp-ts-std/URL'
 *
 * const u = 'https://samhh.com/foo.bar'
 *
 * assert.strictEqual(toString(new URL(u)), u)
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const toString = (x: URL): string => x.toString()
