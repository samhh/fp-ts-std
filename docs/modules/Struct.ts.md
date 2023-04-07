---
title: Struct.ts
nav_order: 39
parent: Modules
---

## Struct overview

This module targets objects in the sense of product types. For objects in
the sense of maps see the `Record` module.

Added in v0.14.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [merge](#merge)
  - [omit](#omit)
  - [omitFrom](#omitfrom)
  - [pick](#pick)
  - [pickFrom](#pickfrom)
  - [renameKey](#renamekey)
  - [withDefaults](#withdefaults)

---

# utils

## merge

Merge two records together. For merging many identical records, instead
consider defining a semigroup.

**Signature**

```ts
export declare const merge: <A, B>(x: A) => <C extends B>(y: C) => A & C
```

```hs
merge :: c extends b => a -> c -> a & c
```

**Example**

```ts
import { merge } from 'fp-ts-std/Struct'

assert.deepStrictEqual(merge({ a: 1, b: 2 })({ b: 'two', c: true }), { a: 1, b: 'two', c: true })
```

Added in v0.14.0

## omit

Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
type.

**Signature**

```ts
export declare const omit: <K extends string>(
  ks: K[]
) => <V, A extends Record<K, V>>(x: A) => Pick<A, Exclude<keyof A, K>>
```

```hs
omit :: k extends string, a extends (Record k v) => Array k -> a -> Pick a (Exclude (keyof a) k)
```

**Example**

```ts
import { omit } from 'fp-ts-std/Struct'

const sansB = omit(['b'])

assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.14.0

## omitFrom

Like `omit`, but allows you to specify the input record upfront.

**Signature**

```ts
export declare const omitFrom: <A>() => <K extends keyof A & string>(ks: K[]) => (x: A) => Pick<A, Exclude<keyof A, K>>
```

```hs
omitFrom :: k extends ((keyof a) & string) => () -> Array k -> a -> Pick a (Exclude (keyof a) k)
```

**Example**

```ts
import { omitFrom } from 'fp-ts-std/Struct'

type MyType = { a: number; b: string; c: ReadonlyArray<boolean> }
const sansB = omitFrom<MyType>()(['b'])

assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.15.0

## pick

Pick a set of keys from a `Record`. The value-level equivalent of the `Pick`
type.

**Signature**

```ts
export declare const pick: <A, K extends keyof A>(ks: K[]) => (x: A) => Pick<A, K>
```

```hs
pick :: k extends (keyof a) => Array k -> a -> Pick a k
```

**Example**

```ts
import { pick } from 'fp-ts-std/Struct'
import { pipe } from 'fp-ts/function'

const picked = pipe({ a: 1, b: 'two', c: [true] }, pick(['a', 'c']))

assert.deepStrictEqual(picked, { a: 1, c: [true] })
```

Added in v0.14.0

## pickFrom

Like `pick`, but allows you to specify the input record upfront.

**Signature**

```ts
export declare const pickFrom: <A>() => <K extends keyof A>(ks: K[]) => (x: A) => Pick<A, K>
```

```hs
pickFrom :: k extends (keyof a) => () -> Array k -> a -> Pick a k
```

**Example**

```ts
import { pickFrom } from 'fp-ts-std/Struct'

type MyType = { a: number; b: string; c: ReadonlyArray<boolean> }
const picked = pickFrom<MyType>()(['a', 'c'])

assert.deepStrictEqual(picked({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.14.0

## renameKey

Rename a key in a struct, preserving the value. If the new key already
exists, the old key will be overwritten. Optionality is preserved.

**Signature**

```ts
export declare const renameKey: <I extends string>(
  oldK: I
) => <J extends string>(newK: J) => <A extends MaybePartial<Record<I, unknown>>>(x: A) => RenameKey<A, I, J>
```

```hs
renameKey :: i extends string, j extends string, a extends (MaybePartial (Record i unknown)) => i -> j -> a -> RenameKey a i j
```

**Example**

```ts
import { renameKey } from 'fp-ts-std/Struct'

type Foo = { a: string; b: number }
type Bar = { a: string; c: number }

const fooBar: (x: Foo) => Bar = renameKey('b')('c')
```

Added in v0.15.0

## withDefaults

Provide default values for an object with optional properties.

**Signature**

```ts
export declare const withDefaults: <
  T extends object,
  PT extends Exact<{ [K in OptionalKeys<T>]-?: Exclude<T[K], undefined> }, PT>
>(
  defaults: PT
) => (t: T) => PT & T
```

**Example**

```ts
import { withDefaults } from 'fp-ts-std/Struct'
import { pipe } from 'fp-ts/function'

const aOptB: { a: number; b?: string } = { a: 1 }

assert.deepStrictEqual(pipe(aOptB, withDefaults({ b: 'foo' })), { a: 1, b: 'foo' })
```

Added in v0.15.0
