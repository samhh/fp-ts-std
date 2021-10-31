---
title: URLSearchParams.ts
nav_order: 26
parent: Modules
---

## URLSearchParams overview

Various functions to aid in working with JavaScript's `URLSearchParams`
interface.

Added in v0.2.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [clone](#clone)
  - [empty](#empty)
  - [fromRecord](#fromrecord)
  - [fromString](#fromstring)
  - [fromTuples](#fromtuples)
  - [getParam](#getparam)
  - [isURLSearchParams](#isurlsearchparams)
  - [setParam](#setparam)

---

# utils

## clone

Clone a `URLSearchParams`.

**Signature**

```ts
export declare const clone: (x: URLSearchParams) => URLSearchParams
```

```hs
clone :: URLSearchParams -> URLSearchParams
```

**Example**

```ts
import { clone, fromString } from 'fp-ts-std/URLSearchParams'

const x = fromString('a=b&c=d')

assert.strictEqual(x === clone(x), false)
assert.deepStrictEqual(x, clone(x))
```

Added in v0.2.0

## empty

An empty `URLSearchParams`.

**Signature**

```ts
export declare const empty: URLSearchParams
```

```hs
empty :: URLSearchParams
```

**Example**

```ts
import { empty } from 'fp-ts-std/URLSearchParams'

assert.deepStrictEqual(empty, new URLSearchParams())
```

Added in v0.2.0

## fromRecord

Parse a `URLSearchParams` from a record.

**Signature**

```ts
export declare const fromRecord: (x: Record<string, string>) => URLSearchParams
```

```hs
fromRecord :: Record string string -> URLSearchParams
```

**Example**

```ts
import { fromRecord } from 'fp-ts-std/URLSearchParams'

const x = { a: 'b', c: 'd' }

assert.deepStrictEqual(fromRecord(x), new URLSearchParams(x))
```

Added in v0.2.0

## fromString

Parse a `URLSearchParams` from a string.

**Signature**

```ts
export declare const fromString: (x: string) => URLSearchParams
```

```hs
fromString :: string -> URLSearchParams
```

**Example**

```ts
import { fromString } from 'fp-ts-std/URLSearchParams'

const x = 'a=b&c=d'

assert.deepStrictEqual(fromString(x), new URLSearchParams(x))
```

Added in v0.2.0

## fromTuples

Parse a `URLSearchParams` from an array of tuples.

**Signature**

```ts
export declare const fromTuples: (x: Array<[string, string]>) => URLSearchParams
```

```hs
fromTuples :: Array [string, string] -> URLSearchParams
```

**Example**

```ts
import { fromTuples } from 'fp-ts-std/URLSearchParams'

const x: Array<[string, string]> = [
  ['a', 'b'],
  ['c', 'd'],
]

assert.deepStrictEqual(fromTuples(x), new URLSearchParams(x))
```

Added in v0.2.0

## getParam

Attempt to get a URL parameter from a `URLSearchParams`.

**Signature**

```ts
export declare const getParam: (k: string) => (ps: URLSearchParams) => Option<string>
```

```hs
getParam :: string -> URLSearchParams -> Option string
```

**Example**

```ts
import { getParam, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d')

assert.deepStrictEqual(getParam('c')(x), O.some('d'))
assert.deepStrictEqual(getParam('e')(x), O.none)
```

Added in v0.1.0

## isURLSearchParams

Refine a foreign value to `URLSearchParams`.

**Signature**

```ts
export declare const isURLSearchParams: Refinement<unknown, URLSearchParams>
```

```hs
isURLSearchParams :: Refinement unknown URLSearchParams
```

**Example**

```ts
import { isURLSearchParams, fromString } from 'fp-ts-std/URLSearchParams'

const x = fromString('a=b&c=d')

assert.deepStrictEqual(isURLSearchParams(x), true)
assert.deepStrictEqual(isURLSearchParams({ not: { a: 'urlsearchparams' } }), false)
```

Added in v0.1.0

## setParam

Set a URL parameter in a `URLSearchParams`. This does not mutate the input.

**Signature**

```ts
export declare const setParam: (k: string) => (v: string) => (x: URLSearchParams) => URLSearchParams
```

```hs
setParam :: string -> string -> URLSearchParams -> URLSearchParams
```

**Example**

```ts
import { setParam, getParam, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d')
const y = setParam('c')('e')(x)

const f = getParam('c')

assert.deepStrictEqual(f(x), O.some('d'))
assert.deepStrictEqual(f(y), O.some('e'))
```

Added in v0.1.0
