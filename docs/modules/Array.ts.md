---
title: Array.ts
nav_order: 1
parent: Modules
---

## Array overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [all](#all)
  - [any](#any)
  - [elemFlipped](#elemflipped)
  - [getDisorderedEq](#getdisorderedeq)
  - [insertMany](#insertmany)
  - [join](#join)
  - [length](#length)
  - [pluckFirst](#pluckfirst)
  - [upsert](#upsert)

---

# utils

## all

Check if a predicate holds true for every array member.

**Signature**

```ts
export declare const all: <A>(f: Predicate<A>) => Predicate<A[]>
```

Added in v0.1.0

## any

Check if a predicate holds true for any array member.

**Signature**

```ts
export declare const any: <A>(f: Predicate<A>) => Predicate<A[]>
```

Added in v0.1.0

## elemFlipped

Like `fp-ts/Array::elem`, but flipped.

**Signature**

```ts
export declare const elemFlipped: <A>(eq: Eq<A>) => (xs: A[]) => Predicate<A>
```

Added in v0.1.0

## getDisorderedEq

Like `fp-ts/Array::getEq`, but items are not required to be in the same
order to determine equivalence. This function is therefore less efficient,
and `getEq` should be preferred on ordered data.

**Signature**

```ts
export declare const getDisorderedEq: <A>(ordA: Ord<A>) => Eq<A[]>
```

Added in v0.1.0

## insertMany

Insert all the elements of an array into another array at the specified
index. Returns `None` if the index is out of bounds.

The array of elements to insert must be non-empty.

**Signature**

```ts
export declare const insertMany: (i: number) => <A>(xs: NonEmptyArray<A>) => (ys: A[]) => Option<NonEmptyArray<A>>
```

**Example**

```ts
import { insertMany } from 'fp-ts-std/Array'
import * as O from 'fp-ts/Option'

const f = insertMany(1)(['a', 'b'])
assert.deepStrictEqual(f([]), O.none)
assert.deepStrictEqual(f(['x']), O.some(['x', 'a', 'b']))
assert.deepStrictEqual(f(['x', 'y']), O.some(['x', 'a', 'b', 'y']))
```

Added in v0.5.0

## join

Join an array of strings together into a single string using the supplied
separator.

**Signature**

```ts
export declare const join: (x: string) => (ys: string[]) => string
```

Added in v0.1.0

## length

Get the length of an array.

**Signature**

```ts
export declare const length: (xs: unknown[]) => number
```

Added in v0.1.0

## pluckFirst

Pluck the first item out of an array matching a predicate. Any further
matches will be left untouched.

This can be thought of as analagous to `fp-ts/Array::findFirst` where
the remaining items, sans the match (if any), are returned as well.

**Signature**

```ts
export declare const pluckFirst: <A>(p: Predicate<A>) => (xs: A[]) => [Option<A>, A[]]
```

Added in v0.1.0

## upsert

Update an item in an array or, if it's not present yet, insert it.

If the item exists more than once (as determined by the supplied `Eq`
instance), only the first to be found will be updated. The order in which
the array is checked is unspecified.

**Signature**

```ts
export declare const upsert: <A>(eqA: Eq<A>) => (x: A) => (ys: A[]) => NonEmptyArray<A>
```

Added in v0.1.0
