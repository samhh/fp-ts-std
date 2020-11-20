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
  - [applyTo](#applyto)
  - [flip](#flip)
  - [unary](#unary)
  - [withIndex](#withindex)

---

# utils

## applyTo

Apply a function, taking the data first. This can be thought of as ordinary
function application, but flipped.

This is useful for applying functions point-free.

**Signature**

```ts
export declare const applyTo: <A>(x: A) => <B>(f: (x: A) => B) => B
```

**Example**

```ts
import { applyTo } from 'fp-ts-std/Function'
import { add, multiply } from 'fp-ts-std/Number'
import * as A from 'fp-ts/Array'
import { pipe, Endomorphism } from 'fp-ts/function'

const calc: Array<Endomorphism<number>> = [add(1), multiply(2)]

const output = pipe(calc, A.map(applyTo(5)))

assert.deepStrictEqual(output, [6, 10])
```

Added in v0.6.0

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

**Example**

```ts
import { flip } from 'fp-ts-std/Function'

const prepend = (x: string) => (y: string): string => x + y
const append = flip(prepend)

assert.strictEqual(prepend('x')('y'), 'xy')
assert.strictEqual(append('x')('y'), 'yx')
```

Added in v0.1.0

## unary

Converts a variadic function to a unary function.

Whilst this isn't very useful for functions that ought to be curried,
it is helpful for functions which take an indefinite number of arguments
instead of more appropriately an array.

**Signature**

```ts
export declare const unary: <A extends unknown[], B>(f: (...xs: A) => B) => (xs: A) => B
```

**Example**

```ts
import { unary } from 'fp-ts-std/Function'

const max = unary(Math.max)

assert.strictEqual(max([1, 3, 2]), 3)
```

Added in v0.6.0

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
