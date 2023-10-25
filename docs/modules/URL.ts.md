---
title: URL.ts
nav_order: 44
parent: Modules
---

## URL overview

Various functions to aid in working with JavaScript's `URL` interface.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [3 Functions](#3-functions)
  - [clone](#clone)
  - [getHash](#gethash)
  - [getHostname](#gethostname)
  - [getOrigin](#getorigin)
  - [getParams](#getparams)
  - [getPathname](#getpathname)
  - [isStringlyURL](#isstringlyurl)
  - [isURL](#isurl)
  - [modifyHash](#modifyhash)
  - [modifyParams](#modifyparams)
  - [modifyPathname](#modifypathname)
  - [parse](#parse)
  - [parseO](#parseo)
  - [setHash](#sethash)
  - [setParams](#setparams)
  - [setPathname](#setpathname)
  - [toString](#tostring)
  - [unsafeParse](#unsafeparse)

---

# 3 Functions

## clone

Clone a `URL` object.

**Signature**

```ts
export declare const clone: Endomorphism<URL>
```

```hs
clone :: Endomorphism URL
```

**Example**

```ts
import { clone } from 'fp-ts-std/URL'

const x = new URL('https://samhh.com/foo')
const y = clone(x)

x.pathname = '/bar'

assert.strictEqual(x.pathname, '/bar')
assert.strictEqual(y.pathname, '/foo')
```

Added in v0.17.0

## getHash

Get the hash component of a `URL`.

**Signature**

```ts
export declare const getHash: (x: URL) => string
```

```hs
getHash :: URL -> string
```

**Example**

```ts
import { getHash } from 'fp-ts-std/URL'

const x = new URL('https://samhh.com#anchor')

assert.strictEqual(getHash(x), '#anchor')
```

Added in v0.18.0

## getHostname

Get the hostname component of a `URL`.

**Signature**

```ts
export declare const getHostname: (x: URL) => string
```

```hs
getHostname :: URL -> string
```

**Example**

```ts
import { getHostname } from 'fp-ts-std/URL'

assert.strictEqual(getHostname(new URL('https://foo.samhh.com/bar')), 'foo.samhh.com')
```

Added in v0.18.0

## getOrigin

Get the origin component of a `URL`.

**Signature**

```ts
export declare const getOrigin: (x: URL) => string
```

```hs
getOrigin :: URL -> string
```

**Example**

```ts
import { getOrigin } from 'fp-ts-std/URL'

assert.strictEqual(getOrigin(new URL('https://samhh.com/foo.bar')), 'https://samhh.com')
```

Added in v0.18.0

## getParams

Get the search params component of a `URL`.

**Signature**

```ts
export declare const getParams: (x: URL) => URLSearchParams
```

```hs
getParams :: URL -> URLSearchParams
```

**Example**

```ts
import { getParams } from 'fp-ts-std/URL'

const x = new URL('https://samhh.com/foo?a=b&c=d')

assert.strictEqual(getParams(x).toString(), new URLSearchParams('?a=b&c=d').toString())
```

Added in v0.18.0

## getPathname

Get the pathname component of a `URL`.

**Signature**

```ts
export declare const getPathname: (x: URL) => string
```

```hs
getPathname :: URL -> string
```

**Example**

```ts
import { getPathname } from 'fp-ts-std/URL'

assert.strictEqual(getPathname(new URL('https://samhh.com/foo?bar=baz')), '/foo')
```

Added in v0.18.0

## isStringlyURL

Test if a string is a valid stringly representation of an absolute URL.

**Signature**

```ts
export declare const isStringlyURL: Predicate<string>
```

```hs
isStringlyURL :: Predicate string
```

**Example**

```ts
import { isStringlyURL } from 'fp-ts-std/URL'

assert.strictEqual(isStringlyURL('https://samhh.com'), true)
assert.strictEqual(isStringlyURL('invalid'), false)
```

Added in v0.18.0

## isURL

Refine a foreign value to `URL`.

**Signature**

```ts
export declare const isURL: Refinement<unknown, URL>
```

```hs
isURL :: Refinement unknown URL
```

**Example**

```ts
import { isURL } from 'fp-ts-std/URL'

assert.strictEqual(isURL(new URL('https://samhh.com')), true)
assert.strictEqual(isURL({ not: { a: 'url' } }), false)
```

Added in v0.1.0

## modifyHash

Modify the hash component of a `URL`.

**Signature**

```ts
export declare const modifyHash: (f: Endomorphism<string>) => Endomorphism<URL>
```

```hs
modifyHash :: Endomorphism string -> Endomorphism URL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { modifyHash, getHash } from 'fp-ts-std/URL'

const x = pipe(
  new URL('https://samhh.com#anchor'),
  modifyHash((s) => s + '!')
)

assert.strictEqual(getHash(x), '#anchor!')
```

Added in v0.18.0

## modifyParams

Modify the search params component of a `URL`.

**Signature**

```ts
export declare const modifyParams: (f: Endomorphism<URLSearchParams>) => Endomorphism<URL>
```

```hs
modifyParams :: Endomorphism URLSearchParams -> Endomorphism URL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { modifyParams, getParams } from 'fp-ts-std/URL'
import { upsertAt } from 'fp-ts-std/URLSearchParams'

const x = pipe(new URL('https://samhh.com/foo?a=b&c=d'), modifyParams(upsertAt('a')('e')))

assert.deepStrictEqual(getParams(x).toString(), new URLSearchParams('?a=e&c=d').toString())
```

Added in v0.18.0

## modifyPathname

Modify the pathname component of a `URL`.

**Signature**

```ts
export declare const modifyPathname: (f: Endomorphism<string>) => Endomorphism<URL>
```

```hs
modifyPathname :: Endomorphism string -> Endomorphism URL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { modifyPathname, getPathname } from 'fp-ts-std/URL'

const x = pipe(
  new URL('https://samhh.com/foo'),
  modifyPathname((s) => s + 'bar'),
  getPathname
)

assert.strictEqual(x, '/foobar')
```

Added in v0.18.0

## parse

Safely parse a `URL`.

**Signature**

```ts
export declare const parse: <E>(f: (e: TypeError) => E) => (x: string) => Either<E, URL>
```

```hs
parse :: (TypeError -> e) -> string -> Either e URL
```

**Example**

```ts
import { parse } from 'fp-ts-std/URL'
import * as E from 'fp-ts/Either'
import { constant } from 'fp-ts/function'

const f = parse(constant('e'))

assert.deepStrictEqual(f('https://samhh.com'), E.right(new URL('https://samhh.com')))
assert.deepStrictEqual(f('invalid'), E.left('e'))
```

Added in v0.1.0

## parseO

Safely parse a `URL`, returning an `Option`.

**Signature**

```ts
export declare const parseO: (href: string) => Option<URL>
```

```hs
parseO :: string -> Option URL
```

**Example**

```ts
import { parseO } from 'fp-ts-std/URL'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(parseO('https://samhh.com'), O.some(new URL('https://samhh.com')))
assert.deepStrictEqual(parseO('invalid'), O.none)
```

Added in v0.1.0

## setHash

Set the hash component of a `URL`.

**Signature**

```ts
export declare const setHash: (x: string) => Endomorphism<URL>
```

```hs
setHash :: string -> Endomorphism URL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { setHash, getHash } from 'fp-ts-std/URL'

const x = pipe(new URL('https://samhh.com#anchor'), setHash('ciao'))

assert.strictEqual(getHash(x), '#ciao')
```

Added in v0.18.0

## setParams

Set the search params component of a `URL`.

**Signature**

```ts
export declare const setParams: (x: URLSearchParams) => Endomorphism<URL>
```

```hs
setParams :: URLSearchParams -> Endomorphism URL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { setParams, getParams } from 'fp-ts-std/URL'

const ps = new URLSearchParams('?c=d')

const x = pipe(new URL('https://samhh.com/foo?a=b'), setParams(ps))

assert.deepStrictEqual(getParams(x).toString(), ps.toString())
```

Added in v0.18.0

## setPathname

Set the pathname component of a `URL`.

**Signature**

```ts
export declare const setPathname: (x: string) => Endomorphism<URL>
```

```hs
setPathname :: string -> Endomorphism URL
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { setPathname, getPathname } from 'fp-ts-std/URL'

const x = pipe(new URL('https://samhh.com/foo'), setPathname('/bar'), getPathname)

assert.strictEqual(x, '/bar')
```

Added in v0.18.0

## toString

Build a string from every piece of a `URL`. Includes a trailing `/` when the
pathname is empty.

**Signature**

```ts
export declare const toString: (x: URL) => string
```

```hs
toString :: URL -> string
```

**Example**

```ts
import { toString } from 'fp-ts-std/URL'

const u = 'https://samhh.com/foo.bar'

assert.strictEqual(toString(new URL(u)), u)
```

Added in v0.18.0

## unsafeParse

Unsafely parse a `URL`, throwing on failure.

**Signature**

```ts
export declare const unsafeParse: (x: string) => URL
```

```hs
unsafeParse :: string -> URL
```

**Example**

```ts
import { unsafeParse } from 'fp-ts-std/URL'

assert.deepStrictEqual(unsafeParse('https://samhh.com'), new URL('https://samhh.com'))
```

Added in v0.1.0
