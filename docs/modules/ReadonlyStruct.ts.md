---
title: ReadonlyStruct.ts
nav_order: 27
parent: Modules
---

## ReadonlyStruct overview

This module targets readonly objects in the sense of product types. For
readonly objects in the sense of maps see the `Record` module.

Added in v0.14.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [merge](#merge)
  - [omit](#omit)
  - [pick](#pick)
  - [pickFrom](#pickfrom)

---

# utils

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
import { merge } from 'fp-ts-std/ReadonlyStruct'

assert.deepStrictEqual(merge({ a: 1, b: 2 })({ b: 'two', c: true }), { a: 1, b: 'two', c: true })
```

Added in v0.14.0

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
import { omit } from 'fp-ts-std/ReadonlyStruct'

const sansB = omit(['b'])

assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.14.0

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
import { pick } from 'fp-ts-std/ReadonlyStruct'
import { pipe } from 'fp-ts/function'

const picked = pipe({ a: 1, b: 'two', c: [true] }, pick(['a', 'c']))

assert.deepStrictEqual(picked, { a: 1, c: [true] })
```

Added in v0.14.0

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
import { pickFrom } from 'fp-ts-std/ReadonlyStruct'

type MyType = { a: number; b: string; c: ReadonlyArray<boolean> }
const picked = pickFrom<MyType>()(['a', 'c'])

assert.deepStrictEqual(picked({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.14.0
