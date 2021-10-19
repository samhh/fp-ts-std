---
title: ReadonlyRecord.ts
nav_order: 16
parent: Modules
---

## ReadonlyRecord overview

Various functions to aid in working with readonly `Record`s and more broadly
readonly objects.

Added in v0.10.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [invertAll](#invertall)
  - [invertLast](#invertlast)
  - [lookupFlipped](#lookupflipped)
  - [merge](#merge)
  - [omit](#omit)
  - [pick](#pick)
  - [pickFrom](#pickfrom)
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
export declare const invertAll: <A>(
  f: (x: A) => string
) => (x: Readonly<Record<string, A>>) => RR.ReadonlyRecord<string, ReadonlyArray<string>>
```

**Example**

```ts
import { invertAll } from 'fp-ts-std/ReadonlyRecord'
import { fromNumber } from 'fp-ts-std/String'

assert.deepStrictEqual(invertAll(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': ['a'], '2': ['b', 'c'], '3': ['d'] })
```

Added in v0.10.0

## invertLast

Invert a record, keeping only the last value should the same key be
encountered more than once. If you'd like to keep the values that would be
lost, see instead `invertAll`.

**Signature**

```ts
export declare const invertLast: <A>(
  f: (x: A) => string
) => (x: Readonly<Record<string, A>>) => RR.ReadonlyRecord<string, string>
```

**Example**

```ts
import { invertLast } from 'fp-ts-std/ReadonlyRecord'
import { fromNumber } from 'fp-ts-std/String'

assert.deepStrictEqual(invertLast(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': 'a', '2': 'c', '3': 'd' })
```

Added in v0.10.0

## lookupFlipped

Like `lookup` from fp-ts, but flipped.

**Signature**

```ts
export declare const lookupFlipped: <A>(x: Readonly<Record<string, A>>) => (k: string) => Option<A>
```

```hs
lookupFlipped :: Readonly (Record string a) -> string -> Option a
```

**Example**

```ts
import { lookupFlipped } from 'fp-ts-std/ReadonlyRecord'
import * as A from 'fp-ts/Array'

const x = { a: 1, b: 'two', c: [true] }
const ks = ['a', 'c']

assert.deepStrictEqual(A.filterMap(lookupFlipped(x))(ks), [1, [true]])
```

Added in v0.10.0

## merge

Merge two records together. For merging many identical records, instead
consider defining a semigroup.

**Signature**

```ts
export declare const merge: <A>(x: A) => <B>(y: B) => A & B
```

```hs
merge :: a -> b -> a & b
```

**Example**

```ts
import { merge } from 'fp-ts-std/ReadonlyRecord'

assert.deepStrictEqual(merge({ a: 1, b: 2 })({ b: 'two', c: true }), { a: 1, b: 'two', c: true })
```

Added in v0.10.0

## omit

Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
type.

**Signature**

```ts
export declare const omit: <K extends string>(
  ks: readonly K[]
) => <V, A extends Readonly<Record<K, V>>>(x: Partial<A>) => Pick<A, Exclude<keyof A, K>>
```

```hs
omit :: k extends string, a extends (Readonly (Record k v)) => Array k -> Partial a -> Pick a (Exclude (keyof a) k)
```

**Example**

```ts
import { omit } from 'fp-ts-std/ReadonlyRecord'

const sansB = omit(['b'])

assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.10.0

## pick

Pick a set of keys from a `Record`. The value-level equivalent of the `Pick`
type.

**Signature**

```ts
export declare const pick: <A, K extends keyof A>(ks: readonly K[]) => (x: A) => Pick<A, K>
```

```hs
pick :: k extends (keyof a) => Array k -> a -> Pick a k
```

**Example**

```ts
import { pick } from 'fp-ts-std/ReadonlyRecord'
import { pipe } from 'fp-ts/function'

const picked = pipe({ a: 1, b: 'two', c: [true] }, pick(['a', 'c']))

assert.deepStrictEqual(picked, { a: 1, c: [true] })
```

Added in v0.10.0

## pickFrom

Like `pick`, but allows you to specify the input record upfront.

**Signature**

```ts
export declare const pickFrom: <A>() => <K extends keyof A>(ks: readonly K[]) => (x: A) => Pick<A, K>
```

```hs
pickFrom :: k extends (keyof a) => () -> Array k -> a -> Pick a k
```

**Example**

```ts
import { pickFrom } from 'fp-ts-std/ReadonlyRecord'

type MyType = { a: number; b: string; c: ReadonlyArray<boolean> }
const picked = pickFrom<MyType>()(['a', 'c'])

assert.deepStrictEqual(picked({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.12.0

## reject

Filters out key/value pairs in the record for which the predicate upon the
value holds. This can be thought of as the inverse of ordinary record
filtering.

**Signature**

```ts
export declare const reject: <A>(f: Predicate<A>) => Endomorphism<Readonly<Record<string, A>>>
```

```hs
reject :: Predicate a -> Endomorphism (Readonly (Record string a))
```

**Example**

```ts
import { reject } from 'fp-ts-std/ReadonlyRecord'
import { Predicate } from 'fp-ts/Predicate'

const isEven: Predicate<number> = (n) => n % 2 === 0

assert.deepStrictEqual(reject(isEven)({ a: 1, b: 2, c: 3, d: 4 }), { a: 1, c: 3 })
```

Added in v0.10.0

## values

Get the values from a `Record`.

**Signature**

```ts
export declare const values: <A>(x: Readonly<Record<string, A>>) => readonly A[]
```

```hs
values :: Readonly (Record string a) -> Array a
```

**Example**

```ts
import { values } from 'fp-ts-std/ReadonlyRecord'

const x = { a: 1, b: 'two' }

assert.deepStrictEqual(values(x), [1, 'two'])
```

Added in v0.10.0
