---
title: Tuple.ts
nav_order: 31
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

```hs
create :: [a, b] -> [a, b]
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

```hs
dup :: a -> [a, a]
```

**Example**

```ts
import { dup } from 'fp-ts-std/Tuple'

assert.deepStrictEqual(dup('x'), ['x', 'x'])
```

Added in v0.12.0

## mapBoth

Apply a function to both elements of a tuple.

**Signature**

```ts
export declare const mapBoth: <A, B>(f: (x: A) => B) => (xs: [A, A]) => [B, B]
```

```hs
mapBoth :: (a -> b) -> [a, a] -> [b, b]
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

```hs
toFst :: (a -> b) -> a -> [b, a]
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

```hs
toSnd :: (a -> b) -> a -> [a, b]
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

```hs
traverseToFst :: f extends URIS4 => Functor4 f -> (a -> Kind4 f s r e b) -> a -> Kind4 f s r e [b, a]
traverseToFst :: f extends URIS3 => ((Functor3 f) -> (a -> Kind3 f r e b) -> a -> Kind3 f r e [b, a])
traverseToFst :: f extends URIS2 => ((Functor2 f) -> (a -> Kind2 f e b) -> a -> Kind2 f e [b, a])
traverseToFst :: f extends URIS2 => ((Functor2C f e) -> (a -> Kind2 f e b) -> a -> Kind2 f e [b, a])
traverseToFst :: f extends URIS => ((Functor1 f) -> (a -> Kind f b) -> a -> Kind f [b, a])
traverseToFst :: ((Functor f) -> (a -> HKT f b) -> a -> HKT f [b, a])
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

```hs
traverseToSnd :: f extends URIS4 => Functor4 f -> (a -> Kind4 f s r e b) -> a -> Kind4 f s r e [a, b]
traverseToSnd :: f extends URIS3 => ((Functor3 f) -> (a -> Kind3 f r e b) -> a -> Kind3 f r e [a, b])
traverseToSnd :: f extends URIS2 => ((Functor2 f) -> (a -> Kind2 f e b) -> a -> Kind2 f e [a, b])
traverseToSnd :: f extends URIS2 => ((Functor2C f e) -> (a -> Kind2 f e b) -> a -> Kind2 f e [a, b])
traverseToSnd :: f extends URIS => ((Functor1 f) -> (a -> Kind f b) -> a -> Kind f [a, b])
traverseToSnd :: ((Functor f) -> (a -> HKT f b) -> a -> HKT f [a, b])
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

```hs
withFst :: a -> b -> [a, b]
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

```hs
withSnd :: a -> b -> [b, a]
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { withSnd } from 'fp-ts-std/Tuple'

assert.deepStrictEqual(pipe('x', withSnd('y')), ['x', 'y'])
```

Added in v0.12.0
