---
title: URLPath.ts
nav_order: 45
parent: Modules
---

## URLPath overview

A wrapper around the `URL` interface for URL paths absent an origin, which
`URL` doesn't natively support.

A path is made up of three parts: the pathname, the search params, and the
hash.

Added in v0.17.0

---

<h2 class="text-delta">Table of contents</h2>

- [0 Types](#0-types)
  - [URLPath (type alias)](#urlpath-type-alias)
- [3 Functions](#3-functions)
  - [fromPathname](#frompathname)
  - [fromString](#fromstring)
  - [fromStringO](#fromstringo)
  - [fromURL](#fromurl)
  - [getHash](#gethash)
  - [getParams](#getparams)
  - [getPathname](#getpathname)
  - [isURLPath](#isurlpath)
  - [modifyHash](#modifyhash)
  - [modifyParams](#modifyparams)
  - [modifyPathname](#modifypathname)
  - [setHash](#sethash)
  - [setParams](#setparams)
  - [setPathname](#setpathname)
  - [toString](#tostring)
  - [toURL](#tourl)
  - [toURLO](#tourlo)

---

# 0 Types

## URLPath (type alias)

Newtype wrapper around `URL`.

**Signature**

```ts
export type URLPath = Newtype<URLPathSymbol, URL>
```

```hs
type URLPath = Newtype URLPathSymbol URL
```

Added in v0.17.0

# 3 Functions

## fromPathname

Build a `URLPath` from a path. Characters such as `?` will be encoded.

**Signature**

```ts
export declare const fromPathname: (x: string) => URLPath
```

```hs
fromPathname :: string -> URLPath
```

**Example**

```ts
import { flow } from 'fp-ts/function'
import { fromPathname, getPathname } from 'fp-ts-std/URLPath'

const f = flow(fromPathname, getPathname)

assert.strictEqual(f('/foo?bar=baz'), '/foo%3Fbar=baz')
```

Added in v0.17.0

## fromString

Build a `URLPath` from a string containing any parts. For an infallible
alternative taking only a pathname, consider `fromPathnamename`.

**Signature**

```ts
export declare const fromString: <E>(f: (e: TypeError) => E) => (x: string) => Either<E, URLPath>
```

```hs
fromString :: (TypeError -> e) -> string -> Either e URLPath
```

**Example**

```ts
import { pipe, constant } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { fromString, fromPathname, setHash } from 'fp-ts-std/URLPath'

const f = fromString(constant('oops'))

const expected = pipe('/foo', fromPathname, setHash('bar'))

assert.deepStrictEqual(f('/foo#bar'), E.right(expected))
assert.deepStrictEqual(f('//'), E.left('oops'))
```

Added in v0.17.0

## fromStringO

Build a `URLPath` from a string containing any parts, forgoing the error.

**Signature**

```ts
export declare const fromStringO: (x: string) => Option<URLPath>
```

```hs
fromStringO :: string -> Option URLPath
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { fromStringO, fromPathname, setHash } from 'fp-ts-std/URLPath'

const expected = pipe('/foo', fromPathname, setHash('bar'))

assert.deepStrictEqual(fromStringO('/foo#bar'), O.some(expected))
assert.deepStrictEqual(fromStringO('//'), O.none)
```

Added in v0.17.0

## fromURL

Convert a `URL` to a `URLPath`. Anything prior to the path such as the origin
will be lost.

**Signature**

```ts
export declare const fromURL: (x: URL) => URLPath
```

```hs
fromURL :: URL -> URLPath
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, toString } from 'fp-ts-std/URLPath'

const x = fromURL(new URL('https://samhh.com/foo?bar=baz'))

assert.strictEqual(toString(x), '/foo?bar=baz')
```

Added in v0.17.0

## getHash

Get the hash component of a `URLPath`.

**Signature**

```ts
export declare const getHash: (x: URLPath) => string
```

```hs
getHash :: URLPath -> string
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, getHash } from 'fp-ts-std/URLPath'

const x = pipe(new URL('https://samhh.com#anchor'), fromURL)

assert.strictEqual(getHash(x), '#anchor')
```

Added in v0.17.0

## getParams

Get the search params component of a `URLPath`.

**Signature**

```ts
export declare const getParams: (x: URLPath) => URLSearchParams
```

```hs
getParams :: URLPath -> URLSearchParams
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, getParams } from 'fp-ts-std/URLPath'

const x = pipe(new URL('https://samhh.com/foo?a=b&c=d'), fromURL)

assert.strictEqual(getParams(x).toString(), new URLSearchParams('?a=b&c=d').toString())
```

Added in v0.17.0

## getPathname

Get the pathname component of a `URLPath`.

**Signature**

```ts
export declare const getPathname: (x: URLPath) => string
```

```hs
getPathname :: URLPath -> string
```

**Example**

```ts
import { flow } from 'fp-ts/function'
import { fromPathname, getPathname } from 'fp-ts-std/URLPath'

const f = flow(fromPathname, getPathname)

assert.strictEqual(f('/foo'), '/foo')
```

Added in v0.17.0

## isURLPath

Check if a foreign value is a `URLPath`.

**Signature**

```ts
export declare const isURLPath: Refinement<unknown, URLPath>
```

```hs
isURLPath :: Refinement unknown URLPath
```

**Example**

```ts
import { isURLPath, fromPathname } from 'fp-ts-std/URLPath'

assert.strictEqual(isURLPath(new URL('https://samhh.com/foo')), false)
assert.strictEqual(isURLPath(fromPathname('/foo')), true)
```

Added in v0.17.0

## modifyHash

Modify the hash component of a `URLPath`.

**Signature**

```ts
export declare const modifyHash: (f: Endomorphism<string>) => Endomorphism<URLPath>
```

```hs
modifyHash :: Endomorphism string -> Endomorphism URLPath
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, modifyHash, getHash } from 'fp-ts-std/URLPath'

const x = pipe(
  new URL('https://samhh.com#anchor'),
  fromURL,
  modifyHash((s) => s + '!')
)

assert.strictEqual(getHash(x), '#anchor!')
```

Added in v0.17.0

## modifyParams

Modify the search params component of a `URLPath`.

**Signature**

```ts
export declare const modifyParams: (f: Endomorphism<URLSearchParams>) => Endomorphism<URLPath>
```

```hs
modifyParams :: Endomorphism URLSearchParams -> Endomorphism URLPath
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, modifyParams, getParams } from 'fp-ts-std/URLPath'
import { setParam } from 'fp-ts-std/URLSearchParams'

const x = pipe(new URL('https://samhh.com/foo?a=b&c=d'), fromURL, modifyParams(setParam('a')('e')))

assert.deepStrictEqual(getParams(x).toString(), new URLSearchParams('?a=e&c=d').toString())
```

Added in v0.17.0

## modifyPathname

Modify the pathname component of a `URLPath`.

**Signature**

```ts
export declare const modifyPathname: (f: Endomorphism<string>) => Endomorphism<URLPath>
```

```hs
modifyPathname :: Endomorphism string -> Endomorphism URLPath
```

**Example**

```ts
import { flow } from 'fp-ts/function'
import { fromPathname, modifyPathname, getPathname } from 'fp-ts-std/URLPath'

const f = flow(
  fromPathname,
  modifyPathname((s) => s + 'bar'),
  getPathname
)

assert.strictEqual(f('/foo'), '/foobar')
```

Added in v0.17.0

## setHash

Set the hash component of a `URLPath`.

**Signature**

```ts
export declare const setHash: (x: string) => Endomorphism<URLPath>
```

```hs
setHash :: string -> Endomorphism URLPath
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, setHash, getHash } from 'fp-ts-std/URLPath'

const x = pipe(new URL('https://samhh.com#anchor'), fromURL, setHash('ciao'))

assert.strictEqual(getHash(x), '#ciao')
```

Added in v0.17.0

## setParams

Set the search params component of a `URLPath`.

**Signature**

```ts
export declare const setParams: (x: URLSearchParams) => Endomorphism<URLPath>
```

```hs
setParams :: URLSearchParams -> Endomorphism URLPath
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, setParams, getParams } from 'fp-ts-std/URLPath'

const ps = new URLSearchParams('?c=d')

const x = pipe(new URL('https://samhh.com/foo?a=b'), fromURL, setParams(ps))

assert.deepStrictEqual(getParams(x).toString(), ps.toString())
```

Added in v0.17.0

## setPathname

Set the pathname component of a `URLPath`.

**Signature**

```ts
export declare const setPathname: (x: string) => Endomorphism<URLPath>
```

```hs
setPathname :: string -> Endomorphism URLPath
```

**Example**

```ts
import { flow } from 'fp-ts/function'
import { fromPathname, setPathname, getPathname } from 'fp-ts-std/URLPath'

const f = flow(fromPathname, setPathname('/bar'), getPathname)

assert.strictEqual(f('/foo'), '/bar')
```

Added in v0.17.0

## toString

Deconstruct a `URLPath` to a string.

**Signature**

```ts
export declare const toString: (x: URLPath) => string
```

```hs
toString :: URLPath -> string
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { toString, fromPathname, setParams, setHash } from 'fp-ts-std/URLPath'

const x = pipe(fromPathname('/foo'), setParams(new URLSearchParams('bar=2000')), setHash('baz'))

assert.strictEqual(toString(x), '/foo?bar=2000#baz')
```

Added in v0.17.0

## toURL

Convert a `URLPath` to a `URL` with the provided `baseUrl`.

**Signature**

```ts
export declare const toURL: <E>(f: (e: TypeError) => E) => (baseUrl: string) => (x: URLPath) => Either<E, URL>
```

```hs
toURL :: (TypeError -> e) -> string -> URLPath -> Either e URL
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { toURL, fromPathname } from 'fp-ts-std/URLPath'

const x = fromPathname('/foo')
const f = toURL(constant('oops'))

assert.deepStrictEqual(f('https://samhh.com')(x), E.right(new URL('https://samhh.com/foo')))
assert.deepStrictEqual(f('bad base')(x), E.left('oops'))
```

Added in v0.17.0

## toURLO

Convert a `URLPath` to a `URL` with the provided `baseUrl`, forgoing the
error.

**Signature**

```ts
export declare const toURLO: (baseUrl: string) => (x: URLPath) => Option<URL>
```

```hs
toURLO :: string -> URLPath -> Option URL
```

**Example**

```ts
import * as O from 'fp-ts/Option'
import { toURLO, fromPathname } from 'fp-ts-std/URLPath'

const x = fromPathname('/foo')

assert.deepStrictEqual(toURLO('https://samhh.com')(x), O.some(new URL('https://samhh.com/foo')))
assert.deepStrictEqual(toURLO('bad base')(x), O.none)
```

Added in v0.17.0
