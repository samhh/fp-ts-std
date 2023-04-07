---
title: Tuple.ts
nav_order: 41
parent: Modules
---

## Tuple overview

Various functions to aid in working with tuples.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [create](#create)
  - [dup](#dup)
  - [fanout](#fanout)
  - [mapBoth](#mapboth)
  - [toFst](#tofst)
  - [toSnd](#tosnd)
  - [traverseToFst](#traversetofst)
  - [traverseToSnd](#traversetosnd)
  - [withFst](#withfst)
  - [withSnd](#withsnd)

---

# utils

## create

Create a tuple. Helps with fighting TypeScript's type inferrence without
having to repeat yourself or use `as const`.

**Signature**

```ts
export declare const create: <A, B>(xs: [A, B]) => [A, B]
```

**Example**

```ts
import { create } from 'fp-ts-std/Tuple'

assert.deepStrictEqual(create(['x', 'y']), ['x', 'y'])
```

Added in v0.12.0

## dup

Duplicate a value into a tuple.

**Signature**

```ts
export declare const dup: <A>(x: A) => [A, A]
```

**Example**

```ts
import { dup } from 'fp-ts-std/Tuple'

assert.deepStrictEqual(dup('x'), ['x', 'x'])
```

Added in v0.12.0

## fanout

Send an input to two functions and combine their outputs in a tuple. For a
variadic version, consider `fork` in `Function`.

**Signature**

```ts
export declare const fanout: <A, B>(f: (x: A) => B) => <C>(g: (x: A) => C) => (x: A) => [B, C]
```

**Example**

```ts
import { fanout } from 'fp-ts-std/Tuple'
import { add } from 'fp-ts-std/Number'
import * as S from 'fp-ts-std/String'

const add2 = add(2)

assert.deepStrictEqual(fanout(S.fromNumber)(add2)(0), ['0', 2])
```

Added in v0.15.0

## mapBoth

Apply a function to both elements of a tuple.

**Signature**

```ts
export declare const mapBoth: <A, B>(f: (x: A) => B) => (xs: [A, A]) => [B, B]
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { mapBoth } from 'fp-ts-std/Tuple'
import { multiply } from 'fp-ts-std/Number'

const xs = pipe([3, 5], mapBoth(multiply(2)))

assert.deepStrictEqual(xs, [6, 10])
```

Added in v0.14.0

## toFst

Apply a function, collecting the output alongside the input. A dual to
`toSnd`.

**Signature**

```ts
export declare const toFst: <A, B>(f: (x: A) => B) => (x: A) => [B, A]
```

**Example**

```ts
import { toFst } from 'fp-ts-std/Tuple'
import { fromNumber } from 'fp-ts-std/String'

assert.deepStrictEqual(toFst(fromNumber)(5), ['5', 5])
```

Added in v0.12.0

## toSnd

Apply a function, collecting the input alongside the output. A dual to
`toFst`.

**Signature**

```ts
export declare const toSnd: <A, B>(f: (x: A) => B) => (x: A) => [A, B]
```

**Example**

```ts
import { toFst } from 'fp-ts-std/Tuple'
import { fromNumber } from 'fp-ts-std/String'

assert.deepStrictEqual(toFst(fromNumber)(5), ['5', 5])
```

Added in v0.12.0

## traverseToFst

Apply a functorial function, collecting the output alongside the input. A
dual to `traverseToSnd`.

**Signature**

```ts
export declare function traverseToFst<F extends URIS4>(
  F: Functor4<F>
): <S, R, E, A, B>(g: (x: A) => Kind4<F, S, R, E, B>) => (x: A) => Kind4<F, S, R, E, [B, A]>
export declare function traverseToFst<F extends URIS3>(
  F: Functor3<F>
): <R, E, A, B>(g: (x: A) => Kind3<F, R, E, B>) => (x: A) => Kind3<F, R, E, [B, A]>
export declare function traverseToFst<F extends URIS2>(
  F: Functor2<F>
): <E, A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [B, A]>
export declare function traverseToFst<F extends URIS2, E>(
  F: Functor2C<F, E>
): <A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [B, A]>
export declare function traverseToFst<F extends URIS>(
  F: Functor1<F>
): <A, B>(g: (x: A) => Kind<F, B>) => (x: A) => Kind<F, [B, A]>
export declare function traverseToFst<F>(F: Functor<F>): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [B, A]>
```

**Example**

```ts
import { traverseToFst } from 'fp-ts-std/Tuple'
import * as O from 'fp-ts/Option'
import { flow, constant } from 'fp-ts/function'
import { fromNumber } from 'fp-ts-std/String'

const traverseToFstO = traverseToFst(O.Functor)
const fromNumberO = flow(fromNumber, O.some)

assert.deepStrictEqual(traverseToFstO(fromNumberO)(5), O.some(['5', 5]))
assert.deepStrictEqual(traverseToFstO(constant(O.none))(5), O.none)
```

Added in v0.12.0

## traverseToSnd

Apply a functorial function, collecting the input alongside the output. A
dual to `traverseToFst`.

**Signature**

```ts
export declare function traverseToSnd<F extends URIS4>(
  F: Functor4<F>
): <S, R, E, A, B>(g: (x: A) => Kind4<F, S, R, E, B>) => (x: A) => Kind4<F, S, R, E, [A, B]>
export declare function traverseToSnd<F extends URIS3>(
  F: Functor3<F>
): <R, E, A, B>(g: (x: A) => Kind3<F, R, E, B>) => (x: A) => Kind3<F, R, E, [A, B]>
export declare function traverseToSnd<F extends URIS2>(
  F: Functor2<F>
): <E, A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [A, B]>
export declare function traverseToSnd<F extends URIS2, E>(
  F: Functor2C<F, E>
): <A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [A, B]>
export declare function traverseToSnd<F extends URIS>(
  F: Functor1<F>
): <A, B>(g: (x: A) => Kind<F, B>) => (x: A) => Kind<F, [A, B]>
export declare function traverseToSnd<F>(F: Functor<F>): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [A, B]>
```

**Example**

```ts
import { traverseToSnd } from 'fp-ts-std/Tuple'
import * as O from 'fp-ts/Option'
import { flow, constant } from 'fp-ts/function'
import { fromNumber } from 'fp-ts-std/String'

const traverseToSndO = traverseToSnd(O.Functor)
const fromNumberO = flow(fromNumber, O.some)

assert.deepStrictEqual(traverseToSndO(fromNumberO)(5), O.some([5, '5']))
assert.deepStrictEqual(traverseToSndO(constant(O.none))(5), O.none)
```

Added in v0.12.0

## withFst

Curried tuple construction. A dual to `withSnd`. Equivalent to Haskell's
tuple sections.

**Signature**

```ts
export declare const withFst: <A>(x: A) => <B>(y: B) => [A, B]
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { withFst } from 'fp-ts-std/Tuple'

assert.deepStrictEqual(pipe('x', withFst('y')), ['y', 'x'])
```

Added in v0.12.0

## withSnd

Curried tuple construction. A dual to `withFst`. Equivalent to Haskell's
tuple sections.

**Signature**

```ts
export declare const withSnd: <A>(x: A) => <B>(y: B) => [B, A]
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { withSnd } from 'fp-ts-std/Tuple'

assert.deepStrictEqual(pipe('x', withSnd('y')), ['x', 'y'])
```

Added in v0.12.0
