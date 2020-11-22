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
  - [construct](#construct)
  - [flip](#flip)
  - [guard](#guard)
  - [ifElse](#ifelse)
  - [memoize](#memoize)
  - [unary](#unary)
  - [unless](#unless)
  - [until](#until)
  - [when](#when)
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

## construct

Wraps a constructor function for functional invocation.

**Signature**

```ts
export declare const construct: <A extends unknown[], B>(x: new (...xs: A) => B) => (xs: A) => B
```

**Example**

```ts
import { construct } from 'fp-ts-std/Function'

const mkURL = construct(URL)

const xs: [string, string] = ['/x/y/z.html', 'https://samhh.com']

assert.deepStrictEqual(mkURL(xs), new URL(...xs))
```

Added in v0.7.0

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

## guard

Given an array of predicates and morphisms, returns the first morphism output
for which the paired predicate succeeded. If all predicates fail, the
fallback value is returned.

This is analagous to Haskell's guards.

**Signature**

```ts
export declare const guard: <A, B>(
  branches: [Predicate<A>, (x: A) => B][]
) => (fallback: (x: A) => B) => (input: A) => B
```

**Example**

```ts
import { guard } from 'fp-ts-std/Function'
import { constant } from 'fp-ts/function'

const numSize = guard<number, string>([
  [(n) => n > 100, (n) => `${n} is large!`],
  [(n) => n > 50, (n) => `${n} is medium.`],
  [(n) => n > 0, (n) => `${n} is small...`],
])((n) => `${n} is not a positive number.`)

assert.strictEqual(numSize(101), '101 is large!')
assert.strictEqual(numSize(99), '99 is medium.')
assert.strictEqual(numSize(5), '5 is small...')
assert.strictEqual(numSize(-3), '-3 is not a positive number.')
```

Added in v0.6.0

## ifElse

Creates a function that processes the first morphism if the predicate
succeeds, else the second morphism.

**Signature**

```ts
export declare const ifElse: <A, B>(onTrue: (x: A) => B) => (onFalse: (x: A) => B) => (f: Predicate<A>) => (x: A) => B
```

**Example**

```ts
import { ifElse } from 'fp-ts-std/Function'
import { increment, decrement } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/function'

const isPositive: Predicate<number> = (n) => n > 0
const normalise = ifElse(decrement)(increment)(isPositive)

assert.strictEqual(normalise(-3), -2)
assert.strictEqual(normalise(3), 2)
```

Added in v0.6.0

## memoize

Given a function and an `Eq` instance for determining input equivalence,
returns a new function that caches the result of applying an input to said
function. If the cache hits, the cached value is returned and the function
is not called again. Useful for expensive computations.

Provided the input function is pure, this function is too.

The cache is implemented as a simple `Map`. There is no mechanism by which
cache entries can be cleared from memory.

**Signature**

```ts
export declare const memoize: <A>(eq: Eq<A>) => <B>(f: (x: A) => B) => (x: A) => B
```

**Example**

```ts
import { memoize } from 'fp-ts-std/Function'
import { add } from 'fp-ts-std/Number'
import { eqNumber } from 'fp-ts/Eq'

let runs = 0
const f = memoize(eqNumber)<number>((n) => {
  runs++
  return add(5)(n)
})

assert.strictEqual(runs, 0)
assert.strictEqual(f(2), 7)
assert.strictEqual(runs, 1)
assert.strictEqual(f(2), 7)
assert.strictEqual(runs, 1)
```

Added in v0.7.0

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

## unless

Runs the provided morphism on the input value if the predicate fails.

**Signature**

```ts
export declare const unless: <A>(f: Predicate<A>) => (onFalse: Endomorphism<A>) => Endomorphism<A>
```

**Example**

```ts
import { unless } from 'fp-ts-std/Function'
import { increment } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/function'

const isEven: Predicate<number> = (n) => n % 2 === 0
const ensureEven = unless(isEven)(increment)

assert.strictEqual(ensureEven(1), 2)
assert.strictEqual(ensureEven(2), 2)
```

Added in v0.6.0

## until

Yields the result of applying the morphism to the input until the predicate
holds.

**Signature**

```ts
export declare const until: <A>(f: Predicate<A>) => (g: Endomorphism<A>) => Endomorphism<A>
```

**Example**

```ts
import { until } from 'fp-ts-std/Function'
import { increment } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/function'

const isOver100: Predicate<number> = (n) => n > 100
const doubleUntilOver100 = until(isOver100)((n) => n * 2)

assert.strictEqual(doubleUntilOver100(1), 128)
```

Added in v0.6.0

## when

Runs the provided morphism on the input value if the predicate holds.

**Signature**

```ts
export declare const when: <A>(f: Predicate<A>) => (onTrue: Endomorphism<A>) => Endomorphism<A>
```

**Example**

```ts
import { when } from 'fp-ts-std/Function'
import { increment } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/function'

const isEven: Predicate<number> = (n) => n % 2 === 0
const ensureOdd = when(isEven)(increment)

assert.strictEqual(ensureOdd(1), 1)
assert.strictEqual(ensureOdd(2), 3)
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
