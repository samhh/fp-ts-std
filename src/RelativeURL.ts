/**
 * A wrapper around the `URL` interface for relative URLs, which `URL` doesn't
 * natively support.
 *
 * A relative URL is made up of three parts: the pathname, the search params,
 * and the hash.
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

type RelativeURLSymbol = { readonly RelativeURLSymbol: unique symbol }

/**
 * Newtype wrapper around `URL`.
 *
 * @since 0.17.0
 */
export type RelativeURL = Newtype<RelativeURLSymbol, URL>

const phonyBase = "https://relativeurl.fp-ts-std.samhh.com"

/**
 * Check if a foreign value is a `RelativeURL`.
 *
 * @example
 * import { isRelativeURL, fromPath } from 'fp-ts-std/RelativeURL'
 *
 * assert.strictEqual(isRelativeURL(new URL('https://samhh.com/foo')), false)
 * assert.strictEqual(isRelativeURL(fromPath('/foo')), true)
 *
 * @since 0.17.0
 */
export const isRelativeURL: Refinement<unknown, RelativeURL> = (
  u,
): u is RelativeURL =>
  // If someone is really setting their base to the same as our phony base
  // then, well, firstly I'm flattered. But secondly that's on them.
  //
  // Also nota bene that the origin check will only work with some protocols.
  isURL(u) && u.origin === phonyBase

/**
 * Convert a `URL` to a `RelativeURL`. Anything not applicable to relative URLs
 * will be lost.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, toString } from 'fp-ts-std/RelativeURL'
 *
 * const x = fromURL(new URL('https://samhh.com/foo?bar=baz'))
 *
 * assert.strictEqual(toString(x), '/foo?bar=baz')
 *
 * @since 0.17.0
 */
export const fromURL = (x: URL): RelativeURL =>
  pipe(new URL(x.href, phonyBase), pack<RelativeURL>)

/**
 * Convert a `RelativeURL` to a `URL` with the provided `baseUrl`.
 *
 * @example
 * import { constant } from 'fp-ts/function';
 * import * as E from 'fp-ts/Either';
 * import { toURL, fromPath } from 'fp-ts-std/RelativeURL'
 *
 * const x = fromPath('/foo')
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
  (x: RelativeURL): Either<E, URL> =>
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    E.tryCatch(
      () => new URL(toString(x), baseUrl),
      e => f(e as TypeError),
    )

/**
 * Convert a `RelativeURL` to a `URL` with the provided `baseUrl`, forgoing the
 * error.
 *
 * @example
 * import * as O from 'fp-ts/Option';
 * import { toURLO, fromPath } from 'fp-ts-std/RelativeURL'
 *
 * const x = fromPath('/foo')
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
export const toURLO = (baseUrl: string): ((x: RelativeURL) => Option<URL>) =>
  flow(toURL(identity)(baseUrl), O.fromEither)

// fallible: example "//"
/**
 * Build a `RelativeURL` from a string containing any parts. For an infallible
 * alternative taking only a path, consider `fromPath`.
 *
 * @example
 * import { pipe, constant } from 'fp-ts/function';
 * import * as E from 'fp-ts/Either';
 * import { fromString, fromPath, setHash } from 'fp-ts-std/RelativeURL'
 *
 * const f = fromString(constant('oops'))
 *
 * const expected = pipe('/foo', fromPath, setHash('bar'))
 *
 * assert.deepStrictEqual(f('/foo#bar'), E.right(expected))
 * assert.deepStrictEqual(f('//'), E.left('oops'))
 *
 * @since 0.17.0
 */
export const fromString =
  <E>(f: (e: TypeError) => E) =>
  (x: string): Either<E, RelativeURL> =>
    pipe(
      // It should only throw some sort of `TypeError`:
      // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
      E.tryCatch(
        () => new URL(x, phonyBase),
        e => f(e as TypeError),
      ),
      E.map(pack<RelativeURL>),
    )

/**
 * Build a `RelativeURL` from a string containing any parts, forgoing the error.
 *
 * @example
 * import { pipe } from 'fp-ts/function';
 * import * as O from 'fp-ts/Option';
 * import { fromStringO, fromPath, setHash } from 'fp-ts-std/RelativeURL'
 *
 * const expected = pipe('/foo', fromPath, setHash('bar'))
 *
 * assert.deepStrictEqual(fromStringO('/foo#bar'), O.some(expected))
 * assert.deepStrictEqual(fromStringO('//'), O.none)
 *
 * @since 0.17.0
 */
export const fromStringO: (x: string) => Option<RelativeURL> = flow(
  fromString(identity),
  O.fromEither,
)

/**
 * Build a `RelativeURL` from a path. Characters such as `?` will be encoded.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { fromPath, getPath } from 'fp-ts-std/RelativeURL'
 *
 * const f = flow(fromPath, getPath)
 *
 * assert.strictEqual(f('/foo?bar=baz'), '/foo%3Fbar=baz')
 *
 * @since 0.17.0
 */
export const fromPath = (x: string): RelativeURL => {
  const y = new URL("", phonyBase)
  // eslint-disable-next-line
  y.pathname = x
  return pack(y)
}

/**
 * Deconstruct a `RelativeURL` to a string.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { toString, fromPath, setParams, setHash } from 'fp-ts-std/RelativeURL'
 *
 * const x = pipe(
 *   fromPath('/foo'),
 *   setParams(new URLSearchParams('bar=2000')),
 *   setHash('baz')
 * )
 *
 * assert.strictEqual(toString(x), '/foo?bar=2000#baz')
 *
 * @since 0.17.0
 */
export const toString: (x: RelativeURL) => string = flow(
  unpack,
  x => x.pathname + x.search + x.hash,
)

/**
 * Get the path component of a `RelativeURL`.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { fromPath, getPath } from 'fp-ts-std/RelativeURL'
 *
 * const f = flow(fromPath, getPath)
 *
 * assert.strictEqual(f('/foo'), '/foo')
 *
 * @since 0.17.0
 */
export const getPath: (x: RelativeURL) => string = flow(unpack, x => x.pathname)

/**
 * Modify the path component of a `RelativeURL`.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { fromPath, modifyPath, getPath } from 'fp-ts-std/RelativeURL'
 *
 * const f = flow(fromPath, modifyPath(s => s + 'bar'), getPath)
 *
 * assert.strictEqual(f('/foo'), '/foobar')
 *
 * @since 0.17.0
 */
export const modifyPath = (
  f: Endomorphism<string>,
): Endomorphism<RelativeURL> =>
  over(
    flow(cloneURL, x => {
      // eslint-disable-next-line
      x.pathname = f(x.pathname)
      return x
    }),
  )

/**
 * Set the path component of a `RelativeURL`.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { fromPath, setPath, getPath } from 'fp-ts-std/RelativeURL'
 *
 * const f = flow(fromPath, setPath('/bar'), getPath)
 *
 * assert.strictEqual(f('/foo'), '/bar')
 *
 * @since 0.17.0
 */
export const setPath = (x: string): Endomorphism<RelativeURL> =>
  modifyPath(constant(x))

/**
 * Get the search params component of a `RelativeURL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, getParams } from 'fp-ts-std/RelativeURL'
 *
 * const x = pipe(new URL('https://samhh.com/foo?a=b&c=d'), fromURL)
 *
 * assert.strictEqual(getParams(x).toString(), (new URLSearchParams('?a=b&c=d')).toString())
 *
 * @since 0.17.0
 */
export const getParams: (x: RelativeURL) => URLSearchParams = flow(
  unpack,
  x => x.searchParams,
)

/**
 * Modify the search params component of a `RelativeURL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, modifyParams, getParams } from 'fp-ts-std/RelativeURL'
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
): Endomorphism<RelativeURL> =>
  over(
    flow(cloneURL, x => {
      // eslint-disable-next-line
      x.search = f(x.searchParams).toString()
      return x
    }),
  )

/**
 * Set the search params component of a `RelativeURL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, setParams, getParams } from 'fp-ts-std/RelativeURL'
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
export const setParams = (x: URLSearchParams): Endomorphism<RelativeURL> =>
  modifyParams(constant(x))

/**
 * Get the hash component of a `RelativeURL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, getHash } from 'fp-ts-std/RelativeURL'
 *
 * const x = pipe(new URL('https://samhh.com#anchor'), fromURL)
 *
 * assert.strictEqual(getHash(x), '#anchor')
 *
 * @since 0.17.0
 */
export const getHash: (x: RelativeURL) => string = flow(unpack, x => x.hash)

/**
 * Modify the hash component of a `RelativeURL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, modifyHash, getHash } from 'fp-ts-std/RelativeURL'
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
export const modifyHash = (
  f: Endomorphism<string>,
): Endomorphism<RelativeURL> =>
  over(
    flow(cloneURL, x => {
      // eslint-disable-next-line
      x.hash = f(x.hash)
      return x
    }),
  )

/**
 * Set the hash component of a `RelativeURL`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { fromURL, setHash, getHash } from 'fp-ts-std/RelativeURL'
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
export const setHash = (x: string): Endomorphism<RelativeURL> =>
  modifyHash(constant(x))
