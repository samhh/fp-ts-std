---
title: Function.ts
nav_order: 6
parent: Modules
---

## Function overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [flip](#flip)
  - [withIndex](#withindex)

---

# utils

## flip

Flip the function/argument order of a curried function.

Note that due to limitations to the type system, this function won't work
correctly for generic functions.

**Signature**

```ts
export declare const flip: <A extends unknown[], B extends unknown[], C>(
  f: (...a: A) => (...b: B) => C
) => (...b: B) => (...a: A) => C
```

Added in v0.1.0

## withIndex

Given a curried function with an iterative callback, this returns a new
function that behaves identically except that it also supplies an index for
each iteration of the callback.

**Signature**

```ts
export declare const withIndex: <A, B, C>(
  f: (g: (x: A) => B) => (ys: A[]) => C[]
) => (g: (i: number) => (x: A) => B) => (ys: A[]) => C[]
```

**Example**

```ts
import * as A from 'fp-ts/Array'
import { withIndex } from 'fp-ts-std/Function'

const mapWithIndex = withIndex<number, number, number>(A.map)
assert.deepStrictEqual(mapWithIndex((i) => (x) => x + i)([1, 2, 3]), [1, 3, 5])
```

Added in v0.5.0
