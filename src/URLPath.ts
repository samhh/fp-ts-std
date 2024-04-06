/**
 * A wrapper around the `URL` interface for URL paths absent an origin, which
 * `URL` doesn't natively support.
 *
 * A path is made up of three parts: the pathname, the search params, and the
 * hash.
 *
 * @since 0.17.0
 */

import { Newtype } from "newtype-ts"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"
import { flow, identity, pipe } from "fp-ts/function"
import { over, pack, unpack } from "./Newtype"
import { Endomorphism } from "fp-ts/Endomorphism"
import * as URL from "./URL"
import { Refinement } from "fp-ts/Refinement"
import * as Eq_ from "fp-ts/Eq"
type Eq<A> = Eq_.Eq<A>

type URLPathSymbol = { readonly URLPathSymbol: unique symbol }

/**
 * Newtype wrapper around `URL`.
 *
 * @example
 * import { URLPath, fromPathname } from 'fp-ts-std/URLPath'
 *
 * const path: URLPath = fromPathname('/foo/bar')
 *
 * @category 0 Types
 * @since 0.17.0
 */
export type URLPath = Newtype<URLPathSymbol, URL>

const phonyBase = "https://urlpath.fp-ts-std.samhh.com"

/**
 * Check if a foreign value is a `URLPath`.
 *
 * @example
 * import { isURLPath, fromPathname } from 'fp-ts-std/URLPath'
 *
 * assert.strictEqual(isURLPath(new URL('https://samhh.com/foo')), false)
 * assert.strictEqual(isURLPath(fromPathname('/foo')), true)
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const isURLPath: Refinement<unknown, URLPath> = (u): u is URLPath =>
  // If someone is really setting their base to the same as our phony base
  // then, well, firstly I'm flattered. But secondly that's on them.
  //
  // Also nota bene that the origin check will only work with some protocols.
  URL.isURL(u) && u.origin === phonyBase

/**
 * Clone a `URLPath`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { clone, fromPathname, getPathname } from 'fp-ts-std/URLPath'
 *
 * const x = fromPathname('/foo')
 * const y = clone(x)
 * ;(x as unknown as URL).pathname = '/bar'
 *
 * assert.strictEqual(getPathname(x), '/bar')
 * assert.strictEqual(getPathname(y), '/foo')
 *
 * @category 3 Functions
 * @since 0.19.0
 */
export const clone: Endomorphism<URLPath> = over(URL.clone)

/**
 * Convert a `URL` to a `URLPath`. Anything prior to the path such as the origin
 * will be lost.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, toString } from 'fp-ts-std/URLPath'
 *
 * const x = fromURL(new URL('https://samhh.com/foo?bar=baz'))
 *
 * assert.strictEqual(toString(x), '/foo?bar=baz')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const fromURL = (x: URL): URLPath =>
  pipe(new globalThis.URL(x.href, phonyBase), pack<URLPath>)

/**
 * Convert a `URLPath` to a `URL` with the provided `baseUrl`.
 *
 * @example
 * import { constant } from 'fp-ts/function';
 * import * as E from 'fp-ts/Either';
 * import { toURL, fromPathname } from 'fp-ts-std/URLPath'
 *
 * const x = fromPathname('/foo')
 * const f = toURL(constant('oops'))
 *
 * assert.deepStrictEqual(
 *   f('https://samhh.com')(x),
 *   E.right(new URL('https://samhh.com/foo')),
 * )
 * assert.deepStrictEqual(
 *   f('bad base')(x),
 *   E.left('oops'),
 * )
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const toURL =
  <E>(f: (e: TypeError) => E) =>
  (baseUrl: string) =>
  (x: URLPath): Either<E, URL> =>
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    E.tryCatch(
      () => new globalThis.URL(toString(x), baseUrl),
      e => f(e as TypeError),
    )

/**
 * Convert a `URLPath` to a `URL` with the provided `baseUrl`, forgoing the
 * error.
 *
 * @example
 * import * as O from 'fp-ts/Option';
 * import { toURLO, fromPathname } from 'fp-ts-std/URLPath'
 *
 * const x = fromPathname('/foo')
 *
 * assert.deepStrictEqual(
 *   toURLO('https://samhh.com')(x),
 *   O.some(new URL('https://samhh.com/foo')),
 * )
 * assert.deepStrictEqual(
 *   toURLO('bad base')(x),
 *   O.none,
 * )
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const toURLO = (baseUrl: string): ((x: URLPath) => Option<URL>) =>
  flow(toURL(identity)(baseUrl), O.fromEither)

/**
 * Build a `URLPath` from a string containing any parts. For an infallible
 * alternative taking only a pathname, consider `fromPathname`.
 *
 * @example
 * import { pipe, constant } from 'fp-ts/function';
 * import * as E from 'fp-ts/Either';
 * import { fromString, fromPathname, setHash } from 'fp-ts-std/URLPath'
 *
 * const f = fromString(constant('oops'))
 *
 * const expected = pipe('/foo', fromPathname, setHash('bar'))
 *
 * assert.deepStrictEqual(f('/foo#bar'), E.right(expected))
 * assert.deepStrictEqual(f('//'), E.left('oops'))
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const fromString =
  <E>(f: (e: TypeError) => E) =>
  (x: string): Either<E, URLPath> =>
    pipe(
      // It should only throw some sort of `TypeError`:
      // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
      E.tryCatch(
        () => new globalThis.URL(x, phonyBase),
        e => f(e as TypeError),
      ),
      E.map(pack<URLPath>),
    )

/**
 * Build a `URLPath` from a string containing any parts, forgoing the error.
 *
 * @example
 * import { pipe } from 'fp-ts/function';
 * import * as O from 'fp-ts/Option';
 * import { fromStringO, fromPathname, setHash } from 'fp-ts-std/URLPath'
 *
 * const expected = pipe('/foo', fromPathname, setHash('bar'))
 *
 * assert.deepStrictEqual(fromStringO('/foo#bar'), O.some(expected))
 * assert.deepStrictEqual(fromStringO('//'), O.none)
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const fromStringO: (x: string) => Option<URLPath> = flow(
  fromString(identity),
  O.fromEither,
)

/**
 * Build a `URLPath` from a path. Characters such as `?` will be encoded.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { fromPathname, getPathname } from 'fp-ts-std/URLPath'
 *
 * const f = flow(fromPathname, getPathname)
 *
 * assert.strictEqual(f('/foo?bar=baz'), '/foo%3Fbar=baz')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const fromPathname = (x: string): URLPath => {
  const y = new globalThis.URL("", phonyBase)
  // eslint-disable-next-line
  y.pathname = x
  return pack(y)
}

/**
 * Deconstruct a `URLPath` to a string.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { toString, fromPathname, setParams, setHash } from 'fp-ts-std/URLPath'
 *
 * const x = pipe(
 *   fromPathname('/foo'),
 *   setParams(new URLSearchParams('bar=2000')),
 *   setHash('baz')
 * )
 *
 * assert.strictEqual(toString(x), '/foo?bar=2000#baz')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const toString: (x: URLPath) => string = flow(
  unpack,
  x => x.pathname + x.search + x.hash,
)

/**
 * Get the pathname component of a `URLPath`.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { fromPathname, getPathname } from 'fp-ts-std/URLPath'
 *
 * const f = flow(fromPathname, getPathname)
 *
 * assert.strictEqual(f('/foo'), '/foo')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const getPathname: (x: URLPath) => string = flow(unpack, URL.getPathname)

/**
 * Modify the pathname component of a `URLPath`.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { fromPathname, modifyPathname, getPathname } from 'fp-ts-std/URLPath'
 *
 * const f = flow(fromPathname, modifyPathname(s => s + 'bar'), getPathname)
 *
 * assert.strictEqual(f('/foo'), '/foobar')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const modifyPathname = (
  f: Endomorphism<string>,
): Endomorphism<URLPath> => over(URL.modifyPathname(f))

/**
 * Set the pathname component of a `URLPath`.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { fromPathname, setPathname, getPathname } from 'fp-ts-std/URLPath'
 *
 * const f = flow(fromPathname, setPathname('/bar'), getPathname)
 *
 * assert.strictEqual(f('/foo'), '/bar')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const setPathname = (x: string): Endomorphism<URLPath> =>
  over(URL.setPathname(x))

/**
 * Get the search params component of a `URLPath`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, getParams } from 'fp-ts-std/URLPath'
 *
 * const x = pipe(new URL('https://samhh.com/foo?a=b&c=d'), fromURL)
 *
 * assert.strictEqual(getParams(x).toString(), (new URLSearchParams('?a=b&c=d')).toString())
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const getParams: (x: URLPath) => URLSearchParams = flow(
  unpack,
  URL.getParams,
)

/**
 * Modify the search params component of a `URLPath`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, modifyParams, getParams } from 'fp-ts-std/URLPath'
 * import { setParam } from 'fp-ts-std/URLSearchParams'
 *
 * const x = pipe(
 *   new URL('https://samhh.com/foo?a=b&c=d'),
 *   fromURL,
 *   modifyParams(setParam('a')('e')),
 * )
 *
 * assert.deepStrictEqual(getParams(x).toString(), (new URLSearchParams('?a=e&c=d')).toString())
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const modifyParams = (
  f: Endomorphism<URLSearchParams>,
): Endomorphism<URLPath> => over(URL.modifyParams(f))

/**
 * Set the search params component of a `URLPath`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, setParams, getParams } from 'fp-ts-std/URLPath'
 *
 * const ps = new URLSearchParams('?c=d')
 *
 * const x = pipe(
 *   new URL('https://samhh.com/foo?a=b'),
 *   fromURL,
 *   setParams(ps),
 * )
 *
 * assert.deepStrictEqual(getParams(x).toString(), ps.toString())
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const setParams = (x: URLSearchParams): Endomorphism<URLPath> =>
  over(URL.setParams(x))

/**
 * Get the hash component of a `URLPath`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, getHash } from 'fp-ts-std/URLPath'
 *
 * const x = pipe(new URL('https://samhh.com#anchor'), fromURL)
 *
 * assert.strictEqual(getHash(x), '#anchor')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const getHash: (x: URLPath) => string = flow(unpack, URL.getHash)

/**
 * Modify the hash component of a `URLPath`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, modifyHash, getHash } from 'fp-ts-std/URLPath'
 *
 * const x = pipe(
 *   new URL('https://samhh.com#anchor'),
 *   fromURL,
 *   modifyHash(s => s + '!'),
 * )
 *
 * assert.strictEqual(getHash(x), '#anchor!')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const modifyHash = (f: Endomorphism<string>): Endomorphism<URLPath> =>
  over(URL.modifyHash(f))

/**
 * Set the hash component of a `URLPath`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, setHash, getHash } from 'fp-ts-std/URLPath'
 *
 * const x = pipe(
 *   new URL('https://samhh.com#anchor'),
 *   fromURL,
 *   setHash('ciao'),
 * )
 *
 * assert.strictEqual(getHash(x), '#ciao')
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const setHash = (x: string): Endomorphism<URLPath> =>
  over(URL.setHash(x))

/**
 * A holistic `Eq` instance for `URLPath`.
 *
 * @example
 * import { Eq, fromPathname } from 'fp-ts-std/URLPath'
 *
 * assert.strictEqual(Eq.equals(fromPathname("/foo"), fromPathname("/foo")), true)
 * assert.strictEqual(Eq.equals(fromPathname("/foo"), fromPathname("/bar")), false)
 *
 * @category 1 Typeclass Instances
 * @since 0.18.0
 */
export const Eq: Eq<URLPath> = Eq_.contramap(unpack)(URL.Eq)
