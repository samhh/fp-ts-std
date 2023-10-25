/**
 * Various functions to aid in working with JavaScript's `URL` interface.
 *
 * @since 0.1.0
 */

import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"
import { constant, flow, identity } from "fp-ts/function"
import { Refinement } from "fp-ts/Refinement"
import { isInstanceOf } from "./Function"
import { Endomorphism } from "fp-ts/Endomorphism"
import { Predicate } from "fp-ts/Predicate"

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
 * Test if a string is a valid stringly representation of an absolute URL.
 *
 * @example
 * import { isStringlyURL } from 'fp-ts-std/URL'
 *
 * assert.strictEqual(isStringlyURL('https://samhh.com'), true)
 * assert.strictEqual(isStringlyURL('invalid'), false)
 *
 * @category 3 Functions
 * @since 0.18.0
 */
// Once browser support improves, use `URL.canParse`.
export const isStringlyURL: Predicate<string> = flow(parseO, O.isSome)

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

/**
 * Get the pathname component of a `URL`.
 *
 * @example
 * import { getPathname } from 'fp-ts-std/URL'
 *
 * assert.strictEqual(getPathname(new URL('https://samhh.com/foo?bar=baz')), '/foo')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const getPathname = (x: URL): string => x.pathname

/**
 * Modify the pathname component of a `URL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { modifyPathname, getPathname } from 'fp-ts-std/URL'
 *
 * const x = pipe(new URL('https://samhh.com/foo'), modifyPathname(s => s + 'bar'), getPathname)
 *
 * assert.strictEqual(x, '/foobar')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const modifyPathname = (f: Endomorphism<string>): Endomorphism<URL> =>
  flow(clone, x => {
    // eslint-disable-next-line
    x.pathname = f(x.pathname)
    return x
  })

/**
 * Set the pathname component of a `URL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { setPathname, getPathname } from 'fp-ts-std/URL'
 *
 * const x = pipe(new URL('https://samhh.com/foo'), setPathname('/bar'), getPathname)
 *
 * assert.strictEqual(x, '/bar')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const setPathname: (x: string) => Endomorphism<URL> = flow(
  constant,
  modifyPathname,
)

/**
 * Get the search params component of a `URL`.
 *
 * @example
 * import { getParams } from 'fp-ts-std/URL'
 *
 * const x = new URL('https://samhh.com/foo?a=b&c=d')
 *
 * assert.strictEqual(getParams(x).toString(), (new URLSearchParams('?a=b&c=d')).toString())
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const getParams = (x: URL): URLSearchParams => x.searchParams

/**
 * Modify the search params component of a `URL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { modifyParams, getParams } from 'fp-ts-std/URL'
 * import { upsertAt } from 'fp-ts-std/URLSearchParams'
 *
 * const x = pipe(
 *   new URL('https://samhh.com/foo?a=b&c=d'),
 *   modifyParams(upsertAt('a')('e')),
 * )
 *
 * assert.deepStrictEqual(getParams(x).toString(), (new URLSearchParams('?a=e&c=d')).toString())
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const modifyParams = (
  f: Endomorphism<URLSearchParams>,
): Endomorphism<URL> =>
  flow(clone, x => {
    // eslint-disable-next-line
    x.search = f(x.searchParams).toString()
    return x
  })

/**
 * Set the search params component of a `URL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { setParams, getParams } from 'fp-ts-std/URL'
 *
 * const ps = new URLSearchParams('?c=d')
 *
 * const x = pipe(
 *   new URL('https://samhh.com/foo?a=b'),
 *   setParams(ps),
 * )
 *
 * assert.deepStrictEqual(getParams(x).toString(), ps.toString())
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const setParams: (x: URLSearchParams) => Endomorphism<URL> = flow(
  constant,
  modifyParams,
)

/**
 * Get the hash component of a `URL`.
 *
 * @example
 * import { getHash } from 'fp-ts-std/URL'
 *
 * const x = new URL('https://samhh.com#anchor')
 *
 * assert.strictEqual(getHash(x), '#anchor')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const getHash = (x: URL): string => x.hash

/**
 * Modify the hash component of a `URL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { modifyHash, getHash } from 'fp-ts-std/URL'
 *
 * const x = pipe(
 *   new URL('https://samhh.com#anchor'),
 *   modifyHash(s => s + '!'),
 * )
 *
 * assert.strictEqual(getHash(x), '#anchor!')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const modifyHash = (f: Endomorphism<string>): Endomorphism<URL> =>
  flow(clone, x => {
    // eslint-disable-next-line
    x.hash = f(x.hash)
    return x
  })

/**
 * Set the hash component of a `URL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { setHash, getHash } from 'fp-ts-std/URL'
 *
 * const x = pipe(
 *   new URL('https://samhh.com#anchor'),
 *   setHash('ciao'),
 * )
 *
 * assert.strictEqual(getHash(x), '#ciao')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const setHash: (x: string) => Endomorphism<URL> = flow(
  constant,
  modifyHash,
)

/**
 * Get the origin component of a `URL`.
 *
 * @example
 * import { getOrigin } from 'fp-ts-std/URL'
 *
 * assert.strictEqual(getOrigin(new URL('https://samhh.com/foo.bar')), 'https://samhh.com')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const getOrigin = (x: URL): string => x.origin;
