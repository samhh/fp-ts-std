---
title: Tuple.ts
nav_order: 43
parent: Modules
---

## Tuple overview

Various functions to aid in working with tuples.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [1 Typeclass Instances](#1-typeclass-instances)
  - [getBounded](#getbounded)
  - [getEnum](#getenum)
  - [getEq](#geteq)
  - [getOrd](#getord)
- [2 Typeclass Methods](#2-typeclass-methods)
  - [mapBoth](#mapboth)
  - [traverseToFst](#traversetofst)
  - [traverseToSnd](#traversetosnd)
- [3 Functions](#3-functions)
  - [create](#create)
  - [dup](#dup)
  - [fanout](#fanout)
  - [toFst](#tofst)
  - [toSnd](#tosnd)
  - [withFst](#withfst)
  - [withSnd](#withsnd)

---

# 1 Typeclass Instances

## getBounded

Derive a `Bounded` instance for a tuple in which the top and bottom
bounds are `[A.top, B.top]` and `[A.bottom, B.bottom]` respectively.

**Signature**

```ts
export declare const getBounded: <A>(BA: Bounded<A>) => <B>(BB: Bounded<B>) => Bounded<[A, B]>
```

```hs
getBounded :: Bounded a -> Bounded b -> Bounded [a, b]
```

Added in v0.17.0

## getEnum

Derive an `Enum` instance for a tuple given an `Enum` instance for each
member.

**Signature**

```ts
export declare const getEnum: <A>(EA: Enum<A>) => <B>(EB: Enum<B>) => Enum<[A, B]>
```

```hs
getEnum :: Enum a -> Enum b -> Enum [a, b]
```

**Example**

```ts
import { universe } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'
import { getEnum } from 'fp-ts-std/Tuple'

const E = getEnum(EnumBool)(EnumBool)

assert.deepStrictEqual(universe(E), [
  [false, false],
  [true, false],
  [false, true],
  [true, true],
])
```

Added in v0.17.0

## getEq

Derive `Eq` for a tuple given `Eq` instances for its members.

**Signature**

```ts
export declare const getEq: <A>(EA: Eq<A>) => <B>(EB: Eq<B>) => Eq<[A, B]>
```

```hs
getEq :: Eq a -> Eq b -> Eq [a, b]
```

**Example**

```ts
import { getEq } from 'fp-ts-std/Tuple'
import * as Str from 'fp-ts/string'
import * as Num from 'fp-ts/number'

const Eq = getEq(Str.Eq)(Num.Eq)

assert.strictEqual(Eq.equals(['foo', 123], ['foo', 123]), true)
assert.strictEqual(Eq.equals(['foo', 123], ['bar', 123]), false)
```

Added in v0.17.0

## getOrd

Derive `Ord` for a tuple given `Ord` instances for its members. The first
component is compared first.

**Signature**

```ts
export declare const getOrd: <A>(OA: Ord<A>) => <B>(OB: Ord<B>) => Ord<[A, B]>
```

```hs
getOrd :: Ord a -> Ord b -> Ord [a, b]
```

**Example**

```ts
import { getOrd } from 'fp-ts-std/Tuple'
import * as Str from 'fp-ts/string'
import * as Num from 'fp-ts/number'
import { LT, EQ, GT } from 'fp-ts-std/Ordering'

const Ord = getOrd(Str.Ord)(Num.Ord)

assert.strictEqual(Ord.compare(['foo', 123], ['foo', 123]), EQ)
assert.strictEqual(Ord.compare(['foo', 123], ['bar', 123]), GT)
```

Added in v0.17.0

# 2 Typeclass Methods

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

# 3 Functions

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

## fanout

Send an input to two functions and combine their outputs in a tuple. For a
variadic version, consider `fork` in `Function`.

**Signature**

```ts
export declare const fanout: <A, B>(f: (x: A) => B) => <C>(g: (x: A) => C) => (x: A) => [B, C]
```

```hs
fanout :: (a -> b) -> (a -> c) -> a -> [b, c]
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
