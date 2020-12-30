---
title: URL.ts
nav_order: 15
parent: Modules
---

## URL overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [isURL](#isurl)
  - [parse](#parse)
  - [parseO](#parseo)
  - [unsafeParse](#unsafeparse)

---

# utils

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
parse :: forall e. (TypeError -> e) -> string -> Either e URL
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
