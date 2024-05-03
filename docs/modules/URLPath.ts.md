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
- [1 Typeclass Instances](#1-typeclass-instances)
  - [Eq](#eq)
- [3 Functions](#3-functions)
  - [clone](#clone)
  - [fromPathname](#frompathname)
  - [fromString](#fromstring)
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

**Example**

```ts
import { URLPath, fromPathname } from 'fp-ts-std/URLPath'

const path: URLPath = fromPathname('/foo/bar')
```

Added in v0.17.0

# 1 Typeclass Instances

## Eq

A holistic `Eq` instance for `URLPath`.

**Signature**

```ts
export declare const Eq: Eq<URLPath>
```

```hs
Eq :: Eq URLPath
```

**Example**

```ts
import { Eq, fromPathname } from 'fp-ts-std/URLPath'

assert.strictEqual(Eq.equals(fromPathname('/foo'), fromPathname('/foo')), true)
assert.strictEqual(Eq.equals(fromPathname('/foo'), fromPathname('/bar')), false)
```

Added in v0.18.0

# 3 Functions

## clone

Clone a `URLPath`.

**Signature**

```ts
export declare const clone: Endomorphism<URLPath>
```

```hs
clone :: Endomorphism URLPath
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { clone, fromPathname, getPathname } from 'fp-ts-std/URLPath'

const x = fromPathname('/foo')
const y = clone(x)
;(x as unknown as URL).pathname = '/bar'

assert.strictEqual(getPathname(x), '/bar')
assert.strictEqual(getPathname(y), '/foo')
```

Added in v0.19.0

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

Build a `URLPath` from a relative or absolute string containing any parts.
Consider also `fromPathname` where only a pathname needs to be parsed.

**Signature**

```ts
export declare const fromString: (x: string) => URLPath
```

```hs
fromString :: string -> URLPath
```

**Example**

```ts
import { pipe, constant } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { fromString, fromPathname, setHash } from 'fp-ts-std/URLPath'

const expected = pipe('/foo', fromPathname, setHash('bar'))

assert.deepStrictEqual(fromString('/foo#bar'), expected)
assert.deepStrictEqual(fromString('https://samhh.com/foo#bar'), expected)
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

Convert a `URLPath` to a `URL` with the provided `origin`. Any other parts of
`origin` will be lost.

**Signature**

```ts
export declare const toURL: (origin: URL) => (path: URLPath) => URL
```

```hs
toURL :: URL -> URLPath -> URL
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { toURL, fromPathname } from 'fp-ts-std/URLPath'

const f = toURL
const x = fromPathname('/foo')

assert.deepStrictEqual(f(new URL('https://samhh.com'))(x), new URL('https://samhh.com/foo'))

assert.deepStrictEqual(f(new URL('https://samhh.com/bar'))(x), new URL('https://samhh.com/foo'))
```

Added in v0.17.0
