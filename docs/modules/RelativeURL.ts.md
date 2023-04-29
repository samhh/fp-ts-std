---
title: RelativeURL.ts
nav_order: 36
parent: Modules
---

## RelativeURL overview

A wrapper around the `URL` interface for relative URLs, which `URL` doesn't
natively support.

A relative URL is made up of three parts: the pathname, the search params,
and the hash.

Added in v0.17.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [RelativeURL (type alias)](#relativeurl-type-alias)
  - [fromPath](#frompath)
  - [fromString](#fromstring)
  - [fromStringO](#fromstringo)
  - [fromURL](#fromurl)
  - [getHash](#gethash)
  - [getParams](#getparams)
  - [getPath](#getpath)
  - [isRelativeURL](#isrelativeurl)
  - [modifyHash](#modifyhash)
  - [modifyParams](#modifyparams)
  - [modifyPath](#modifypath)
  - [setHash](#sethash)
  - [setParams](#setparams)
  - [setPath](#setpath)
  - [toString](#tostring)
  - [toURL](#tourl)
  - [toURLO](#tourlo)

---

# utils

## RelativeURL (type alias)

Newtype wrapper around `URL`.

**Signature**

```ts
export type RelativeURL = Newtype<RelativeURLSymbol, URL>
```

```hs
type RelativeURL = Newtype RelativeURLSymbol URL
```

Added in v0.17.0

## fromPath

Build a `RelativeURL` from a path. Characters such as `?` will be encoded.

**Signature**

```ts
export declare const fromPath: (x: string) => RelativeURL
```

```hs
fromPath :: string -> RelativeURL
```

**Example**

```ts
import { flow } from 'fp-ts/function'
import { fromPath, getPath } from 'fp-ts-std/RelativeURL'

const f = flow(fromPath, getPath)

assert.strictEqual(f('/foo?bar=baz'), '/foo%3Fbar=baz')
```

Added in v0.17.0

## fromString

Build a `RelativeURL` from a string containing any parts. For an infallible
alternative taking only a path, consider `fromPath`.

**Signature**

```ts
export declare const fromString: <E>(f: (e: TypeError) => E) => (x: string) => Either<E, RelativeURL>
```

```hs
fromString :: (TypeError -> e) -> string -> Either e RelativeURL
```

**Example**

```ts
import { pipe, constant } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { fromString, fromPath, setHash } from 'fp-ts-std/RelativeURL'

const f = fromString(constant('oops'))

const expected = pipe('/foo', fromPath, setHash('bar'))

assert.deepStrictEqual(f('/foo#bar'), E.right(expected))
assert.deepStrictEqual(f('//'), E.left('oops'))
```

Added in v0.17.0

## fromStringO

Build a `RelativeURL` from a string containing any parts, forgoing the error.

**Signature**

```ts
export declare const fromStringO: (x: string) => Option<RelativeURL>
```

```hs
fromStringO :: string -> Option RelativeURL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { fromStringO, fromPath, setHash } from 'fp-ts-std/RelativeURL'

const expected = pipe('/foo', fromPath, setHash('bar'))

assert.deepStrictEqual(fromStringO('/foo#bar'), O.some(expected))
assert.deepStrictEqual(fromStringO('//'), O.none)
```

Added in v0.17.0

## fromURL

Convert a `URL` to a `RelativeURL`. Anything not applicable to relative URLs
will be lost.

**Signature**

```ts
export declare const fromURL: (x: URL) => RelativeURL
```

```hs
fromURL :: URL -> RelativeURL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, toString } from 'fp-ts-std/RelativeURL'

const x = fromURL(new URL('https://samhh.com/foo?bar=baz'))

assert.strictEqual(toString(x), '/foo?bar=baz')
```

Added in v0.17.0

## getHash

Get the hash component of a `RelativeURL`.

**Signature**

```ts
export declare const getHash: (x: RelativeURL) => string
```

```hs
getHash :: RelativeURL -> string
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, getHash } from 'fp-ts-std/RelativeURL'

const x = pipe(new URL('https://samhh.com#anchor'), fromURL)

assert.strictEqual(getHash(x), '#anchor')
```

Added in v0.17.0

## getParams

Get the search params component of a `RelativeURL`.

**Signature**

```ts
export declare const getParams: (x: RelativeURL) => URLSearchParams
```

```hs
getParams :: RelativeURL -> URLSearchParams
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, getParams } from 'fp-ts-std/RelativeURL'

const x = pipe(new URL('https://samhh.com/foo?a=b&c=d'), fromURL)

assert.strictEqual(getParams(x).toString(), new URLSearchParams('?a=b&c=d').toString())
```

Added in v0.17.0

## getPath

Get the path component of a `RelativeURL`.

**Signature**

```ts
export declare const getPath: (x: RelativeURL) => string
```

```hs
getPath :: RelativeURL -> string
```

**Example**

```ts
import { flow } from 'fp-ts/function'
import { fromPath, getPath } from 'fp-ts-std/RelativeURL'

const f = flow(fromPath, getPath)

assert.strictEqual(f('/foo'), '/foo')
```

Added in v0.17.0

## isRelativeURL

Check if a foreign value is a `RelativeURL`.

**Signature**

```ts
export declare const isRelativeURL: Refinement<unknown, RelativeURL>
```

```hs
isRelativeURL :: Refinement unknown RelativeURL
```

**Example**

```ts
import { isRelativeURL, fromPath } from 'fp-ts-std/RelativeURL'

assert.strictEqual(isRelativeURL(new URL('https://samhh.com/foo')), false)
assert.strictEqual(isRelativeURL(fromPath('/foo')), true)
```

Added in v0.17.0

## modifyHash

Modify the hash component of a `RelativeURL`.

**Signature**

```ts
export declare const modifyHash: (f: Endomorphism<string>) => Endomorphism<RelativeURL>
```

```hs
modifyHash :: Endomorphism string -> Endomorphism RelativeURL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, modifyHash, getHash } from 'fp-ts-std/RelativeURL'

const x = pipe(
  new URL('https://samhh.com#anchor'),
  fromURL,
  modifyHash((s) => s + '!')
)

assert.strictEqual(getHash(x), '#anchor!')
```

Added in v0.17.0

## modifyParams

Modify the search params component of a `RelativeURL`.

**Signature**

```ts
export declare const modifyParams: (f: Endomorphism<URLSearchParams>) => Endomorphism<RelativeURL>
```

```hs
modifyParams :: Endomorphism URLSearchParams -> Endomorphism RelativeURL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, modifyParams, getParams } from 'fp-ts-std/RelativeURL'
import { setParam } from 'fp-ts-std/URLSearchParams'

const x = pipe(new URL('https://samhh.com/foo?a=b&c=d'), fromURL, modifyParams(setParam('a')('e')))

assert.deepStrictEqual(getParams(x).toString(), new URLSearchParams('?a=e&c=d').toString())
```

Added in v0.17.0

## modifyPath

Modify the path component of a `RelativeURL`.

**Signature**

```ts
export declare const modifyPath: (f: Endomorphism<string>) => Endomorphism<RelativeURL>
```

```hs
modifyPath :: Endomorphism string -> Endomorphism RelativeURL
```

**Example**

```ts
import { flow } from 'fp-ts/function'
import { fromPath, modifyPath, getPath } from 'fp-ts-std/RelativeURL'

const f = flow(
  fromPath,
  modifyPath((s) => s + 'bar'),
  getPath
)

assert.strictEqual(f('/foo'), '/foobar')
```

Added in v0.17.0

## setHash

Set the hash component of a `RelativeURL`.

**Signature**

```ts
export declare const setHash: (x: string) => Endomorphism<RelativeURL>
```

```hs
setHash :: string -> Endomorphism RelativeURL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, setHash, getHash } from 'fp-ts-std/RelativeURL'

const x = pipe(new URL('https://samhh.com#anchor'), fromURL, setHash('ciao'))

assert.strictEqual(getHash(x), '#ciao')
```

Added in v0.17.0

## setParams

Set the search params component of a `RelativeURL`.

**Signature**

```ts
export declare const setParams: (x: URLSearchParams) => Endomorphism<RelativeURL>
```

```hs
setParams :: URLSearchParams -> Endomorphism RelativeURL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { fromURL, setParams, getParams } from 'fp-ts-std/RelativeURL'

const ps = new URLSearchParams('?c=d')

const x = pipe(new URL('https://samhh.com/foo?a=b'), fromURL, setParams(ps))

assert.deepStrictEqual(getParams(x).toString(), ps.toString())
```

Added in v0.17.0

## setPath

Set the path component of a `RelativeURL`.

**Signature**

```ts
export declare const setPath: (x: string) => Endomorphism<RelativeURL>
```

```hs
setPath :: string -> Endomorphism RelativeURL
```

**Example**

```ts
import { flow } from 'fp-ts/function'
import { fromPath, setPath, getPath } from 'fp-ts-std/RelativeURL'

const f = flow(fromPath, setPath('/bar'), getPath)

assert.strictEqual(f('/foo'), '/bar')
```

Added in v0.17.0

## toString

Deconstruct a `RelativeURL` to a string.

**Signature**

```ts
export declare const toString: (x: RelativeURL) => string
```

```hs
toString :: RelativeURL -> string
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { toString, fromPath, setParams, setHash } from 'fp-ts-std/RelativeURL'

const x = pipe(fromPath('/foo'), setParams(new URLSearchParams('bar=2000')), setHash('baz'))

assert.strictEqual(toString(x), '/foo?bar=2000#baz')
```

Added in v0.17.0

## toURL

Convert a `RelativeURL` to a `URL` with the provided `baseUrl`.

**Signature**

```ts
export declare const toURL: <E>(f: (e: TypeError) => E) => (baseUrl: string) => (x: RelativeURL) => Either<E, URL>
```

```hs
toURL :: (TypeError -> e) -> string -> RelativeURL -> Either e URL
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { toURL, fromPath } from 'fp-ts-std/RelativeURL'

const x = fromPath('/foo')
const f = toURL(constant('oops'))

assert.deepStrictEqual(f('https://samhh.com')(x), E.right(new URL('https://samhh.com/foo')))
assert.deepStrictEqual(f('bad base')(x), E.left('oops'))
```

Added in v0.17.0

## toURLO

Convert a `RelativeURL` to a `URL` with the provided `baseUrl`, forgoing the
error.

**Signature**

```ts
export declare const toURLO: (baseUrl: string) => (x: RelativeURL) => Option<URL>
```

```hs
toURLO :: string -> RelativeURL -> Option URL
```

**Example**

```ts
import * as O from 'fp-ts/Option'
import { toURLO, fromPath } from 'fp-ts-std/RelativeURL'

const x = fromPath('/foo')

assert.deepStrictEqual(toURLO('https://samhh.com')(x), O.some(new URL('https://samhh.com/foo')))
assert.deepStrictEqual(toURLO('bad base')(x), O.none)
```

Added in v0.17.0
