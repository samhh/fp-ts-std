---
title: Record.ts
nav_order: 25
parent: Modules
---

## Record overview

This module targets objects in the sense of maps. For objects in the sense
of product types see the `Struct` module.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [invertAll](#invertall)
  - [invertLast](#invertlast)
  - [lookupV](#lookupv)
  - [reject](#reject)
  - [values](#values)

---

# utils

## invertAll

Invert a record, collecting values with duplicate keys in an array. Should
you only care about the last item or are not worried about the risk of
duplicate keys, see instead `invertLast`.

**Signature**

```ts
export declare const invertAll: <A>(f: (x: A) => string) => (x: Record<string, A>) => Record<string, Array<string>>
```

```hs
invertAll :: (a -> string) -> Record string a -> Record string (Array string)
```

**Example**

```ts
import { invertAll } from 'fp-ts-std/Record'
import { fromNumber } from 'fp-ts-std/String'

assert.deepStrictEqual(invertAll(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': ['a'], '2': ['b', 'c'], '3': ['d'] })
```

Added in v0.7.0

## invertLast

Invert a record, keeping only the last value should the same key be
encountered more than once. If you'd like to keep the values that would be
lost, see instead `invertAll`.

**Signature**

```ts
export declare const invertLast: <A>(f: (x: A) => string) => (x: Record<string, A>) => Record<string, string>
```

```hs
invertLast :: (a -> string) -> Record string a -> Record string string
```

**Example**

```ts
import { invertLast } from 'fp-ts-std/Record'
import { fromNumber } from 'fp-ts-std/String'

assert.deepStrictEqual(invertLast(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': 'a', '2': 'c', '3': 'd' })
```

Added in v0.7.0

## lookupV

Like `fp-ts/Record::lookup` but flipped, which the "V" suffix denotes.

**Signature**

```ts
export declare const lookupV: <A>(x: Record<string, A>) => (k: string) => Option<A>
```

```hs
lookupV :: Record string a -> string -> Option a
```

**Example**

```ts
import { lookupV } from 'fp-ts-std/Record'
import * as A from 'fp-ts/Array'

const x = { a: 1, b: 'two', c: [true] }
const ks = ['a', 'c']

assert.deepStrictEqual(A.filterMap(lookupV(x))(ks), [1, [true]])
```

Added in v0.1.0

## reject

Filters out key/value pairs in the record for which the predicate upon the
value holds. This can be thought of as the inverse of ordinary record
filtering.

**Signature**

```ts
export declare const reject: <A>(f: Predicate<A>) => Endomorphism<Record<string, A>>
```

```hs
reject :: Predicate a -> Endomorphism (Record string a)
```

**Example**

```ts
import { reject } from 'fp-ts-std/Record'
import { Predicate } from 'fp-ts/Predicate'

const isEven: Predicate<number> = (n) => n % 2 === 0

assert.deepStrictEqual(reject(isEven)({ a: 1, b: 2, c: 3, d: 4 }), { a: 1, c: 3 })
```

Added in v0.7.0

## values

Get the values from a `Record`.

**Signature**

```ts
export declare const values: <A>(x: Record<string, A>) => A[]
```

```hs
values :: Record string a -> Array a
```

**Example**

```ts
import { values } from 'fp-ts-std/Record'

const x = { a: 1, b: 'two' }

assert.deepStrictEqual(values(x), [1, 'two'])
```

Added in v0.1.0
