/**
 * Various functions to aid in working with JavaScript's `URL` interface.
 *
 * @since 0.1.0
 */

import { Option } from "fp-ts/lib/Option.js"
import * as O from "fp-ts/lib/Option.js"
import { Either } from "fp-ts/lib/Either.js"
import * as E from "fp-ts/lib/Either.js"
import { flow, identity, pipe } from "fp-ts/lib/function.js"
import { Refinement } from "fp-ts/lib/Refinement.js"
import { construct, isInstanceOf } from "./Function.js"
import { Endomorphism } from "fp-ts/lib/Endomorphism.js"

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
export const clone: Endomorphism<URL> = u => unsafeParse(u.href)

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
export const unsafeParse = (x: string): URL => pipe([x], construct(URL))

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
