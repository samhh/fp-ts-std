---
title: Record.ts
nav_order: 11
parent: Modules
---

## Record overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [lookupFlipped](#lookupflipped)
  - [omit](#omit)
  - [pick](#pick)
  - [reject](#reject)
  - [values](#values)

---

# utils

## lookupFlipped

Like `lookup` from fp-ts, but flipped.

**Signature**

```ts
export declare const lookupFlipped: <A>(x: Record<string, A>) => (k: string) => Option<A>
```

**Example**

```ts
import { lookupFlipped } from 'fp-ts-std/Record'
import * as A from 'fp-ts/Array'

const x = { a: 1, b: 'two', c: [true] }
const ks = ['a', 'c']

assert.deepStrictEqual(A.filterMap(lookupFlipped(x))(ks), [1, [true]])
```

Added in v0.1.0

## omit

Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
type.

**Signature**

```ts
export declare const omit: <K extends string>(
  ks: K[]
) => <V, A extends Record<K, V>>(x: Partial<A>) => Pick<A, Exclude<keyof A, K>>
```

**Example**

```ts
import { omit } from 'fp-ts-std/Record'

const sansB = omit(['b'])

assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.1.0

## pick

Pick a set of keys from a `Record`. The value-level equivalent of the `Pick`
type.

**Signature**

```ts
export declare const pick: <A>() => <K extends keyof A>(ks: K[]) => (x: A) => Pick<A, K>
```

**Example**

```ts
import { pick } from 'fp-ts-std/Record'

type MyType = { a: number; b: string; c: Array<boolean> }
const picked = pick<MyType>()(['a', 'c'])

assert.deepStrictEqual(picked({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
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

**Example**

```ts
import { reject } from 'fp-ts-std/Record'
import { Predicate } from 'fp-ts/function'

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

**Example**

```ts
import { values } from 'fp-ts-std/Record'

const x = { a: 1, b: 'two' }

assert.deepStrictEqual(values(x), [1, 'two'])
```

Added in v0.1.0
