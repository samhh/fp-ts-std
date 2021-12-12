---
title: Function.ts
nav_order: 10
parent: Modules
---

## Function overview

Note that some limitations exist in the type system pertaining to
polymorphic (generic) functions which could impact the usage of any of the
functions here. All of these functions will work provided monomorphic
(non-generic) input functions.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [applyEvery](#applyevery)
  - [applySomes](#applysomes)
  - [construct](#construct)
  - [converge](#converge)
  - [curry2](#curry2)
  - [curry2T](#curry2t)
  - [curry3](#curry3)
  - [curry3T](#curry3t)
  - [curry4](#curry4)
  - [curry4T](#curry4t)
  - [curry5](#curry5)
  - [curry5T](#curry5t)
  - [flip](#flip)
  - [fork](#fork)
  - [guard](#guard)
  - [ifElse](#ifelse)
  - [invoke](#invoke)
  - [invokeOn](#invokeon)
  - [is](#is)
  - [memoize](#memoize)
  - [unary](#unary)
  - [uncurry2](#uncurry2)
  - [uncurry3](#uncurry3)
  - [uncurry4](#uncurry4)
  - [uncurry5](#uncurry5)
  - [unless](#unless)
  - [until](#until)
  - [when](#when)
  - [withIndex](#withindex)

---

# utils

## applyEvery

Apply an array of endomorphisms from left-to-right.

**Signature**

```ts
export declare const applyEvery: <A>(fs: Endomorphism<A>[]) => Endomorphism<A>
```

```hs
applyEvery :: Array (Endomorphism a) -> Endomorphism a
```

**Example**

```ts
import { applyEvery } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'
import { increment, multiply } from 'fp-ts-std/Number'

const fs: Array<Endomorphism<number>> = [increment, multiply(3)]
const g = applyEvery(fs)

assert.deepStrictEqual(g(1), 6)
assert.deepStrictEqual(g(3), 12)
```

Added in v0.12.0

## applySomes

Apply an array of potential endomorphisms from left-to-right, skipping any
that are `None`.

**Signature**

```ts
export declare const applySomes: <A>(fs: O.Option<Endomorphism<A>>[]) => Endomorphism<A>
```

**Example**

```ts
import { applySomes } from 'fp-ts-std/Function'
import * as O from 'fp-ts/Option'
import { Option } from 'fp-ts/Option'
import { Endomorphism } from 'fp-ts/Endomorphism'
import { increment, multiply } from 'fp-ts-std/Number'

const fs: Array<Option<Endomorphism<number>>> = [O.some(increment), O.none, O.some(multiply(3))]
const g = applySomes(fs)

assert.deepStrictEqual(g(1), 6)
assert.deepStrictEqual(g(3), 12)
```

Added in v0.13.0

## construct

Wraps a constructor function for functional invocation.

**Signature**

```ts
export declare const construct: <A extends unknown[], B>(x: new (...xs: A) => B) => (xs: A) => B
```

```hs
construct :: a extends (Array unknown) => (...a -> b) -> a -> b
```

**Example**

```ts
import { construct } from 'fp-ts-std/Function'

const mkURL = construct(URL)

const xs: [string, string] = ['/x/y/z.html', 'https://samhh.com']

assert.deepStrictEqual(mkURL(xs), new URL(...xs))
```

Added in v0.7.0

## converge

Takes a converging function and a tuple of branching functions. The branched
return values are collected in a tuple and passed to the converging function.

**Signature**

```ts
export declare const converge: <B, C extends B[], D>(
  f: (xs: [B, ...C]) => D
) => <A>(gs: [(x: A) => B, ...{ [K in keyof C]: (x: A) => C[K] }]) => (x: A) => D
```

**Example**

```ts
import { converge } from 'fp-ts-std/Function'
import { flow, identity } from 'fp-ts/function'
import * as S from 'fp-ts-std/String'
import * as A from 'fp-ts-std/Array'

const f = converge(A.join(' '))([S.append('!'), identity, S.prepend('?')])

assert.deepStrictEqual(f('hello'), 'hello! hello ?hello')
```

Added in v0.12.0

## curry2

Curry a function with binary input.

**Signature**

```ts
export declare const curry2: <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C
```

```hs
curry2 :: ((a, b) -> c) -> a -> b -> c
```

**Example**

```ts
import { curry2 } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat2 = (a: string, b: string): string => a + b
assert.strictEqual(curry2(concat2)('a')('b'), concat2('a', 'b'))
```

Added in v0.7.0

## curry2T

Curry a function with binary tuple input.

**Signature**

```ts
export declare const curry2T: <A, B, C>(f: (xs: [A, B]) => C) => (a: A) => (b: B) => C
```

```hs
curry2T :: ([a, b] -> c) -> a -> b -> c
```

**Example**

```ts
import { curry2T } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat2 = ([a, b]: [string, string]): string => a + b
assert.strictEqual(curry2T(concat2)('a')('b'), concat2(['a', 'b']))
```

Added in v0.7.0

## curry3

Curry a function with ternary input.

**Signature**

```ts
export declare const curry3: <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (a: A) => (b: B) => (c: C) => D
```

```hs
curry3 :: ((a, b, c) -> d) -> a -> b -> c -> d
```

**Example**

```ts
import { curry3 } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat3 = (a: string, b: string, c: string): string => a + b + c
assert.strictEqual(curry3(concat3)('a')('b')('c'), concat3('a', 'b', 'c'))
```

Added in v0.7.0

## curry3T

Curry a function with ternary tuple input.

**Signature**

```ts
export declare const curry3T: <A, B, C, D>(f: (xs: [A, B, C]) => D) => (a: A) => (b: B) => (c: C) => D
```

```hs
curry3T :: ([a, b, c] -> d) -> a -> b -> c -> d
```

**Example**

```ts
import { curry3T } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat3 = ([a, b, c]: [string, string, string]): string => a + b + c
assert.strictEqual(curry3T(concat3)('a')('b')('c'), concat3(['a', 'b', 'c']))
```

Added in v0.7.0

## curry4

Curry a function with quaternary input.

**Signature**

```ts
export declare const curry4: <A, B, C, D, E>(
  f: (a: A, b: B, c: C, d: D) => E
) => (a: A) => (b: B) => (c: C) => (d: D) => E
```

```hs
curry4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e
```

**Example**

```ts
import { curry4 } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat4 = (a: string, b: string, c: string, d: string): string => a + b + c + d
assert.strictEqual(curry4(concat4)('a')('b')('c')('d'), concat4('a', 'b', 'c', 'd'))
```

Added in v0.7.0

## curry4T

Curry a function with quaternary tuple input.

**Signature**

```ts
export declare const curry4T: <A, B, C, D, E>(f: (xs: [A, B, C, D]) => E) => (a: A) => (b: B) => (c: C) => (d: D) => E
```

```hs
curry4T :: ([a, b, c, d] -> e) -> a -> b -> c -> d -> e
```

**Example**

```ts
import { curry4T } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat4 = ([a, b, c, d]: [string, string, string, string]): string => a + b + c + d
assert.strictEqual(curry4T(concat4)('a')('b')('c')('d'), concat4(['a', 'b', 'c', 'd']))
```

Added in v0.7.0

## curry5

Curry a function with quinary input.

**Signature**

```ts
export declare const curry5: <A, B, C, D, E, F>(
  f: (a: A, b: B, c: C, d: D, e: E) => F
) => (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F
```

```hs
curry5 :: ((a, b, c, d, e) -> f) -> a -> b -> c -> d -> e -> f
```

**Example**

```ts
import { curry5 } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat5 = (a: string, b: string, c: string, d: string, e: string): string => a + b + c + d + e
assert.strictEqual(curry5(concat5)('a')('b')('c')('d')('e'), concat5('a', 'b', 'c', 'd', 'e'))
```

Added in v0.7.0

## curry5T

Curry a function with quinary tuple input.

**Signature**

```ts
export declare const curry5T: <A, B, C, D, E, F>(
  f: (xs: [A, B, C, D, E]) => F
) => (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F
```

```hs
curry5T :: ([a, b, c, d, e] -> f) -> a -> b -> c -> d -> e -> f
```

**Example**

```ts
import { curry5T } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat5 = ([a, b, c, d, e]: [string, string, string, string, string]): string => a + b + c + d + e
assert.strictEqual(curry5T(concat5)('a')('b')('c')('d')('e'), concat5(['a', 'b', 'c', 'd', 'e']))
```

Added in v0.7.0

## flip

Flip the function/argument order of a curried function.

**Signature**

```ts
export declare const flip: <A, B, C>(f: (x: A) => (y: B) => C) => (x: B) => (y: A) => C
```

```hs
flip :: (a -> b -> c) -> b -> a -> c
```

**Example**

```ts
import { flip } from 'fp-ts-std/Function'

const prepend =
  (x: string) =>
  (y: string): string =>
    x + y
const append = flip(prepend)

assert.strictEqual(prepend('x')('y'), 'xy')
assert.strictEqual(append('x')('y'), 'yx')
```

Added in v0.1.0

## fork

Fork an input across a series of functions, collecting the results in a
tuple. Similar to `flap` but overloaded for variadic tuples.

**Signature**

```ts
export declare function fork<A, B, C>(fs: [(x: A) => B, (x: A) => C]): (x: A) => [B, C]
export declare function fork<A, B, C, D>(fs: [(x: A) => B, (x: A) => C, (x: A) => D]): (x: A) => [B, C, D]
export declare function fork<A, B, C, D, E>(
  fs: [(x: A) => B, (x: A) => C, (x: A) => D, (x: A) => E]
): (x: A) => [B, C, D, E]
export declare function fork<A, B, C, D, E, F>(
  fs: [(x: A) => B, (x: A) => C, (x: A) => D, (x: A) => E, (x: A) => F]
): (x: A) => [B, C, D, E, F]
export declare function fork<A, B, C, D, E, F, G>(
  fs: [(x: A) => B, (x: A) => C, (x: A) => D, (x: A) => E, (x: A) => F, (x: A) => G]
): (x: A) => [B, C, D, E, F, G]
export declare function fork<A, B, C, D, E, F, G, H>(
  fs: [(x: A) => B, (x: A) => C, (x: A) => D, (x: A) => E, (x: A) => F, (x: A) => G, (x: A) => H]
): (x: A) => [B, C, D, E, F, G, H]
export declare function fork<A, B, C, D, E, F, G, H, I>(
  fs: [(x: A) => B, (x: A) => C, (x: A) => D, (x: A) => E, (x: A) => F, (x: A) => G, (x: A) => H, (x: A) => I]
): (x: A) => [B, C, D, E, F, G, H, I]
export declare function fork<A, B, C, D, E, F, G, H, I, J>(
  fs: [
    (x: A) => B,
    (x: A) => C,
    (x: A) => D,
    (x: A) => E,
    (x: A) => F,
    (x: A) => G,
    (x: A) => H,
    (x: A) => I,
    (x: A) => J
  ]
): (x: A) => [B, C, D, E, F, G, H, I, J]
```

**Example**

```ts
import { fork } from 'fp-ts-std/Function'
import { add } from 'fp-ts-std/Number'
import * as S from 'fp-ts-std/String'

const add1 = add(1)
const add2 = add(2)

assert.deepStrictEqual(fork([add1, S.fromNumber, add2])(0), [1, '0', 2])
```

Added in v0.11.0

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

```hs
guard :: Array [(Predicate a), a -> b] -> (a -> b) -> a -> b
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

```hs
ifElse :: (a -> b) -> (a -> b) -> Predicate a -> a -> b
```

**Example**

```ts
import { ifElse } from 'fp-ts-std/Function'
import { increment, decrement } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/Predicate'

const isPositive: Predicate<number> = (n) => n > 0
const normalise = ifElse(decrement)(increment)(isPositive)

assert.strictEqual(normalise(-3), -2)
assert.strictEqual(normalise(3), 2)
```

Added in v0.6.0

## invoke

Invoke a method of the specified name with the provided arguments on an
object. Helpful for a one-time usage of an object-oriented construct you're
working with that doesn't have functional bindings.

To write your own bindings more conveniently, check out `invokeOn`.

**Signature**

```ts
export declare const invoke: <A extends string>(
  x: A
) => <B extends unknown[]>(ys: [...B]) => <C>(z: Record<A, (...xs: B) => C>) => C
```

**Example**

```ts
import { invoke } from 'fp-ts-std/Function'

const f = invoke('padStart')([8, '.'])

assert.strictEqual(f('hello'), '...hello')
```

Added in v0.12.0

## invokeOn

Like `invoke`, but takes an initial type argument to hint at what shape the
arguments tuple should be. This function is useful for producing bindings for
object-oriented methods in tandem with the tuple*N*T range of functions.

**Signature**

```ts
export declare const invokeOn: <A>() => <
  B extends { [K in keyof A]: A[K] extends (...xs: Array<any>) => unknown ? A[K] : never },
  C extends keyof B
>(
  x: C
) => (xs: Required<Parameters<B[C]>>) => (y: B) => ReturnType<B[C]>
```

**Example**

```ts
import { invokeOn, curry2T } from 'fp-ts-std/Function'

const padStart = curry2T(invokeOn<string>()('padStart'))
const x = 'hello'

assert.strictEqual(padStart(8)('.')(x), x.padStart(8, '.'))
```

Added in v0.12.0

## is

A curried function equivalent to the `instanceof` operator, for when you
absolutely must test a prototype.

**Signature**

```ts
export declare const is: <A>(x: new (...args: Array<any>) => unknown) => Refinement<unknown, A>
```

```hs
is :: (...Array any -> unknown) -> Refinement unknown a
```

**Example**

```ts
import { is } from 'fp-ts-std/Function'

const isString = is(String)

assert.strictEqual(isString('ciao'), false)
assert.strictEqual(isString(new String('ciao')), true)
```

Added in v0.12.0

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

```hs
memoize :: Eq a -> (a -> b) -> a -> b
```

**Example**

```ts
import { memoize } from 'fp-ts-std/Function'
import { add } from 'fp-ts-std/Number'
import { eqNumber } from 'fp-ts/Eq'

let runs = 0
const f = memoize(eqNumber)((n) => {
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

```hs
unary :: a extends (Array unknown) => (...a -> b) -> a -> b
```

**Example**

```ts
import { unary } from 'fp-ts-std/Function'

const max = unary(Math.max)

assert.strictEqual(max([1, 3, 2]), 3)
```

Added in v0.6.0

## uncurry2

Uncurry a binary function.

**Signature**

```ts
export declare const uncurry2: <A, B, C>(f: (a: A) => (b: B) => C) => ([a, b]: [A, B]) => C
```

```hs
uncurry2 :: (a -> b -> c) -> [a, b] -> c
```

**Example**

```ts
import { uncurry2 } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat2 =
  (a: string): Endomorphism<string> =>
  (b) =>
    a + b
assert.strictEqual(uncurry2(concat2)(['a', 'b']), concat2('a')('b'))
```

Added in v0.7.0

## uncurry3

Uncurry a ternary function.

**Signature**

```ts
export declare const uncurry3: <A, B, C, D>(f: (a: A) => (b: B) => (c: C) => D) => ([a, b, c]: [A, B, C]) => D
```

```hs
uncurry3 :: (a -> b -> c -> d) -> [a, b, c] -> d
```

**Example**

```ts
import { uncurry3 } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat3 =
  (a: string) =>
  (b: string): Endomorphism<string> =>
  (c) =>
    a + b + c
assert.strictEqual(uncurry3(concat3)(['a', 'b', 'c']), concat3('a')('b')('c'))
```

Added in v0.7.0

## uncurry4

Uncurry a quaternary function.

**Signature**

```ts
export declare const uncurry4: <A, B, C, D, E>(
  f: (a: A) => (b: B) => (c: C) => (d: D) => E
) => ([a, b, c, d]: [A, B, C, D]) => E
```

```hs
uncurry4 :: (a -> b -> c -> d -> e) -> [a, b, c, d] -> e
```

**Example**

```ts
import { uncurry4 } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat4 =
  (a: string) =>
  (b: string) =>
  (c: string): Endomorphism<string> =>
  (d) =>
    a + b + c + d
assert.strictEqual(uncurry4(concat4)(['a', 'b', 'c', 'd']), concat4('a')('b')('c')('d'))
```

Added in v0.7.0

## uncurry5

Uncurry a quinary function.

**Signature**

```ts
export declare const uncurry5: <A, B, C, D, E, F>(
  f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F
) => ([a, b, c, d, e]: [A, B, C, D, E]) => F
```

```hs
uncurry5 :: (a -> b -> c -> d -> e -> f) -> [a, b, c, d, e] -> f
```

**Example**

```ts
import { uncurry5 } from 'fp-ts-std/Function'
import { Endomorphism } from 'fp-ts/Endomorphism'

const concat5 =
  (a: string) =>
  (b: string) =>
  (c: string) =>
  (d: string): Endomorphism<string> =>
  (e) =>
    a + b + c + d + e
assert.strictEqual(uncurry5(concat5)(['a', 'b', 'c', 'd', 'e']), concat5('a')('b')('c')('d')('e'))
```

Added in v0.7.0

## unless

Runs the provided morphism on the input value if the predicate fails.

**Signature**

```ts
export declare const unless: <A>(f: Predicate<A>) => (onFalse: Endomorphism<A>) => Endomorphism<A>
```

```hs
unless :: Predicate a -> Endomorphism a -> Endomorphism a
```

**Example**

```ts
import { unless } from 'fp-ts-std/Function'
import { increment } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/Predicate'

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

```hs
until :: Predicate a -> Endomorphism a -> Endomorphism a
```

**Example**

```ts
import { until } from 'fp-ts-std/Function'
import { increment } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/Predicate'

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

```hs
when :: Predicate a -> Endomorphism a -> Endomorphism a
```

**Example**

```ts
import { when } from 'fp-ts-std/Function'
import { increment } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/Predicate'

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

```hs
withIndex :: ((a -> b) -> Array a -> Array c) -> (number -> a -> b) -> Array a -> Array c
```

**Example**

```ts
import * as A from 'fp-ts/Array'
import { withIndex } from 'fp-ts-std/Function'

const mapWithIndex = withIndex<number, number, number>(A.map)
assert.deepStrictEqual(mapWithIndex((i) => (x) => x + i)([1, 2, 3]), [1, 3, 5])
```

Added in v0.5.0
