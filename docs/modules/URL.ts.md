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
  - [isStringlyURL](#isstringlyurl)
  - [isURL](#isurl)
  - [parse](#parse)
  - [parseO](#parseo)
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
