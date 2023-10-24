---
title: URLSearchParams.ts
nav_order: 46
parent: Modules
---

## URLSearchParams overview

Various functions to aid in working with JavaScript's `URLSearchParams`
interface.

Added in v0.2.0

---

<h2 class="text-delta">Table of contents</h2>

- [1 Typeclass Instances](#1-typeclass-instances)
  - [Eq](#eq)
- [3 Functions](#3-functions)
  - [appendAt](#appendat)
  - [clone](#clone)
  - [deleteAt](#deleteat)
  - [empty](#empty)
  - [fromRecord](#fromrecord)
  - [fromString](#fromstring)
  - [fromTuples](#fromtuples)
  - [isEmpty](#isempty)
  - [isURLSearchParams](#isurlsearchparams)
  - [lookup](#lookup)
  - [lookupFirst](#lookupfirst)
  - [singleton](#singleton)
  - [toRecord](#torecord)
  - [toString](#tostring)
  - [toTuples](#totuples)
  - [upsertAt](#upsertat)
- [5 Zone of Death](#5-zone-of-death)
  - [~~getAllForParam~~](#getallforparam)
  - [~~getParam~~](#getparam)
  - [~~setParam~~](#setparam)

---

# 1 Typeclass Instances

## Eq

An `Eq` instance for `URLSearchParams` in which equivalence is determined
without respect to order.

**Signature**

```ts
export declare const Eq: Eq_.Eq<URLSearchParams>
```

**Example**

```ts
import { Eq, fromString as f } from 'fp-ts-std/URLSearchParams'

assert.strictEqual(Eq.equals(f('a=1&b=2&a=3'), f('b=2&a=3&a=1')), true)
assert.strictEqual(Eq.equals(f('a=1&b=2&a=3'), f('a=1&b=2')), false)
```

Added in v0.18.0

# 3 Functions

## appendAt

Append a URL parameter in a `URLSearchParams`.

**Signature**

```ts
export declare const appendAt: (k: string) => (v: string) => Endomorphism<URLSearchParams>
```

```hs
appendAt :: string -> string -> Endomorphism URLSearchParams
```

**Example**

```ts
import { appendAt, lookup, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d')
const y = appendAt('c')('e')(x)

const f = lookup('c')

assert.deepStrictEqual(f(x), O.some(['d']))
assert.deepStrictEqual(f(y), O.some(['d', 'e']))
```

Added in v0.18.0

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

## deleteAt

Delete all URL parameters with the specified key.

**Signature**

```ts
export declare const deleteAt: (k: string) => Endomorphism<URLSearchParams>
```

```hs
deleteAt :: string -> Endomorphism URLSearchParams
```

**Example**

```ts
import { deleteAt, lookup, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d&a=e')
const y = deleteAt('a')(x)

const f = lookup('a')

assert.deepStrictEqual(f(x), O.some(['b', 'e']))
assert.deepStrictEqual(f(y), O.none)
```

Added in v0.18.0

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
export declare const fromRecord: (x: Record<string, Array<string>>) => URLSearchParams
```

```hs
fromRecord :: Record string (Array string) -> URLSearchParams
```

**Example**

```ts
import { fromRecord } from 'fp-ts-std/URLSearchParams'

const r = { a: ['b', 'c'], d: ['e'] }
const s = 'a=b&a=c&d=e'

assert.deepStrictEqual(fromRecord(r), new URLSearchParams(s))
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

## isEmpty

Test if there are any search params.

**Signature**

```ts
export declare const isEmpty: Predicate<URLSearchParams>
```

```hs
isEmpty :: Predicate URLSearchParams
```

**Example**

```ts
import { isEmpty } from 'fp-ts-std/URLSearchParams'

assert.strictEqual(isEmpty(new URLSearchParams()), true)
assert.strictEqual(isEmpty(new URLSearchParams({ k: 'v' })), false)
```

Added in v0.16.0

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

## lookup

Attempt to get all matches for a URL parameter from a `URLSearchParams`.

**Signature**

```ts
export declare const lookup: (k: string) => (ps: URLSearchParams) => Option<NonEmptyArray<string>>
```

```hs
lookup :: string -> URLSearchParams -> Option (NonEmptyArray string)
```

**Example**

```ts
import { lookup, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d1&c=d2')

assert.deepStrictEqual(lookup('a')(x), O.some(['b']))
assert.deepStrictEqual(lookup('c')(x), O.some(['d1', 'd2']))
assert.deepStrictEqual(lookup('e')(x), O.none)
```

Added in v0.18.0

## lookupFirst

Attempt to get the first match for a URL parameter from a `URLSearchParams`.

**Signature**

```ts
export declare const lookupFirst: (k: string) => (ps: URLSearchParams) => Option<string>
```

```hs
lookupFirst :: string -> URLSearchParams -> Option string
```

**Example**

```ts
import { lookupFirst, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d1&c=d2')

assert.deepStrictEqual(lookupFirst('c')(x), O.some('d1'))
assert.deepStrictEqual(lookupFirst('e')(x), O.none)
```

Added in v0.18.0

## singleton

Construct a `URLSearchParams` from a single key/value pair.

**Signature**

```ts
export declare const singleton: (k: string) => (v: string) => URLSearchParams
```

```hs
singleton :: string -> string -> URLSearchParams
```

**Example**

```ts
import { singleton } from 'fp-ts-std/URLSearchParams'

assert.deepStrictEqual(singleton('k')('v'), new URLSearchParams({ k: 'v' }))
```

Added in v0.18.0

## toRecord

Convert a `URLSearchParams` to a record, grouping values by keys.

**Signature**

```ts
export declare const toRecord: (x: URLSearchParams) => Record<string, NonEmptyArray<string>>
```

```hs
toRecord :: URLSearchParams -> Record string (NonEmptyArray string)
```

**Example**

```ts
import { toRecord } from 'fp-ts-std/URLSearchParams'

const x = new URLSearchParams('a=b&c=d&a=e')

assert.deepStrictEqual(toRecord(x), { a: ['b', 'e'], c: ['d'] })
```

Added in v0.17.0

## toString

Returns a query string suitable for use in a URL, absent a question mark.

**Signature**

```ts
export declare const toString: (x: URLSearchParams) => string
```

```hs
toString :: URLSearchParams -> string
```

**Example**

```ts
import { toString } from 'fp-ts-std/URLSearchParams'

const x = new URLSearchParams('a=b&c=d')

assert.strictEqual(toString(x), 'a=b&c=d')
```

Added in v0.17.0

## toTuples

Losslessly convert a `URLSearchParams` to an array of tuples.

**Signature**

```ts
export declare const toTuples: (x: URLSearchParams) => Array<[string, string]>
```

```hs
toTuples :: URLSearchParams -> Array [string, string]
```

**Example**

```ts
import { toTuples } from 'fp-ts-std/URLSearchParams'

const x = new URLSearchParams('a=b&c=d&a=e')

assert.deepStrictEqual(toTuples(x), [
  ['a', 'b'],
  ['c', 'd'],
  ['a', 'e'],
])
```

Added in v0.17.0

## upsertAt

Insert or replace a URL parameter in a `URLSearchParams`.

**Signature**

```ts
export declare const upsertAt: (k: string) => (v: string) => Endomorphism<URLSearchParams>
```

```hs
upsertAt :: string -> string -> Endomorphism URLSearchParams
```

**Example**

```ts
import { upsertAt, lookupFirst, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d')
const y = upsertAt('c')('e')(x)

const f = lookupFirst('c')

assert.deepStrictEqual(f(x), O.some('d'))
assert.deepStrictEqual(f(y), O.some('e'))
```

Added in v0.18.0

# 5 Zone of Death

## ~~getAllForParam~~

Attempt to get all matches for a URL parameter from a `URLSearchParams`.

**Signature**

```ts
export declare const getAllForParam: (k: string) => (ps: URLSearchParams) => Option<NonEmptyArray<string>>
```

```hs
getAllForParam :: string -> URLSearchParams -> Option (NonEmptyArray string)
```

**Example**

```ts
import { getAllForParam, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d1&c=d2')

assert.deepStrictEqual(getAllForParam('a')(x), O.some(['b']))
assert.deepStrictEqual(getAllForParam('c')(x), O.some(['d1', 'd2']))
assert.deepStrictEqual(getAllForParam('e')(x), O.none)
```

Added in v0.16.0

## ~~getParam~~

Attempt to get the first match for a URL parameter from a `URLSearchParams`.

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

const x = fromString('a=b&c=d1&c=d2')

assert.deepStrictEqual(getParam('c')(x), O.some('d1'))
assert.deepStrictEqual(getParam('e')(x), O.none)
```

Added in v0.1.0

## ~~setParam~~

Set a URL parameter in a `URLSearchParams`.

**Signature**

```ts
export declare const setParam: (k: string) => (v: string) => Endomorphism<URLSearchParams>
```

```hs
setParam :: string -> string -> Endomorphism URLSearchParams
```

**Example**

```ts
import { setParam, lookupFirst, fromString } from 'fp-ts-std/URLSearchParams'
import * as O from 'fp-ts/Option'

const x = fromString('a=b&c=d')
const y = setParam('c')('e')(x)

const f = lookupFirst('c')

assert.deepStrictEqual(f(x), O.some('d'))
assert.deepStrictEqual(f(y), O.some('e'))
```

Added in v0.1.0
