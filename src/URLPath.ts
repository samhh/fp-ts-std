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
import { constant, flow, identity, pipe } from "fp-ts/function"
import { over, pack, unpack } from "./Newtype"
import { Endomorphism } from "fp-ts/Endomorphism"
import { clone as cloneURL, isURL } from "./URL"
import { Refinement } from "fp-ts/Refinement"

type URLPathSymbol = { readonly URLPathSymbol: unique symbol }

/**
 * Newtype wrapper around `URL`.
 *
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
 * @since 0.17.0
 */
export const isURLPath: Refinement<unknown, URLPath> = (u): u is URLPath =>
  // If someone is really setting their base to the same as our phony base
  // then, well, firstly I'm flattered. But secondly that's on them.
  //
  // Also nota bene that the origin check will only work with some protocols.
  isURL(u) && u.origin === phonyBase

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
 * @since 0.17.0
 */
export const fromURL = (x: URL): URLPath =>
  pipe(new URL(x.href, phonyBase), pack<URLPath>)

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
 * @since 0.17.0
 */
export const toURL =
  <E>(f: (e: TypeError) => E) =>
  (baseUrl: string) =>
  (x: URLPath): Either<E, URL> =>
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    E.tryCatch(
      () => new URL(toString(x), baseUrl),
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
 * @since 0.17.0
 */
export const toURLO = (baseUrl: string): ((x: URLPath) => Option<URL>) =>
  flow(toURL(identity)(baseUrl), O.fromEither)

// fallible: example "//"
/**
 * Build a `URLPath` from a string containing any parts. For an infallible
 * alternative taking only a pathname, consider `fromPathnamename`.
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
 * @since 0.17.0
 */
export const fromString =
  <E>(f: (e: TypeError) => E) =>
  (x: string): Either<E, URLPath> =>
    pipe(
      // It should only throw some sort of `TypeError`:
      // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
      E.tryCatch(
        () => new URL(x, phonyBase),
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
 * @since 0.17.0
 */
export const fromPathname = (x: string): URLPath => {
  const y = new URL("", phonyBase)
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
 * @since 0.17.0
 */
export const getPathname: (x: URLPath) => string = flow(unpack, x => x.pathname)

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
 * @since 0.17.0
 */
export const modifyPathname = (
  f: Endomorphism<string>,
): Endomorphism<URLPath> =>
  over(
    flow(cloneURL, x => {
      // eslint-disable-next-line
      x.pathname = f(x.pathname)
      return x
    }),
  )

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
 * @since 0.17.0
 */
export const setPathname = (x: string): Endomorphism<URLPath> =>
  modifyPathname(constant(x))

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
 * @since 0.17.0
 */
export const getParams: (x: URLPath) => URLSearchParams = flow(
  unpack,
  x => x.searchParams,
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
 * @since 0.17.0
 */
export const modifyParams = (
  f: Endomorphism<URLSearchParams>,
): Endomorphism<URLPath> =>
  over(
    flow(cloneURL, x => {
      // eslint-disable-next-line
      x.search = f(x.searchParams).toString()
      return x
    }),
  )

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
 * @since 0.17.0
 */
export const setParams = (x: URLSearchParams): Endomorphism<URLPath> =>
  modifyParams(constant(x))

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
 * @since 0.17.0
 */
export const getHash: (x: URLPath) => string = flow(unpack, x => x.hash)

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
 * @since 0.17.0
 */
export const modifyHash = (f: Endomorphism<string>): Endomorphism<URLPath> =>
  over(
    flow(cloneURL, x => {
      // eslint-disable-next-line
      x.hash = f(x.hash)
      return x
    }),
  )

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
 * @since 0.17.0
 */
export const setHash = (x: string): Endomorphism<URLPath> =>
  modifyHash(constant(x))
