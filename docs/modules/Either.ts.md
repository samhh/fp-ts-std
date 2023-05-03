---
title: Either.ts
nav_order: 9
parent: Modules
---

## Either overview

Utility functions to accommodate `fp-ts/Either`.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [mapBoth](#mapboth)
  - [match2](#match2)
  - [unsafeExpect](#unsafeexpect)
  - [unsafeExpectLeft](#unsafeexpectleft)
  - [unsafeUnwrap](#unsafeunwrap)
  - [unsafeUnwrapLeft](#unsafeunwrapleft)

---

# utils

## mapBoth

Apply a function to both elements of an `Either`.

**Signature**

```ts
export declare const mapBoth: <A, B>(f: (x: A) => B) => (xs: Either<A, A>) => Either<B, B>
```

```hs
mapBoth :: (a -> b) -> Either a a -> Either b b
```

**Example**

```ts
import * as E from 'fp-ts/Either'
import { mapBoth } from 'fp-ts-std/Either'
import { multiply } from 'fp-ts-std/Number'

const f = mapBoth(multiply(2))

assert.deepStrictEqual(f(E.left(3)), E.left(6))
assert.deepStrictEqual(f(E.right(3)), E.right(6))
```

Added in v0.14.0

## match2

Pattern match against two `Either`s simultaneously.

**Signature**

```ts
export declare const match2: <A, B, C, D, E>(
  onLeftLeft: (x: A) => (y: C) => E,
  onLeftRight: (x: A) => (y: D) => E,
  onRightLeft: (x: B) => (y: C) => E,
  onRightRight: (x: B) => (y: D) => E
) => (mab: Either<A, B>) => (mcd: Either<C, D>) => E
```

```hs
match2 :: ((a -> c -> e), (a -> d -> e), (b -> c -> e), (b -> d -> e)) -> Either a b -> Either c d -> e
```

**Example**

```ts
import { withFst } from 'fp-ts-std/Tuple'
import * as E from 'fp-ts/Either'
import Either = E.Either
import { match2 } from 'fp-ts-std/Either'

const pair: (x: string) => (y: string) => [string, string] = withFst

const f: (x: Either<string, string>) => (y: Either<string, string>) => [string, string] = match2(pair, pair, pair, pair)

assert.deepStrictEqual(f(E.left('l'))(E.left('l')), ['l', 'l'])
assert.deepStrictEqual(f(E.left('l'))(E.right('r')), ['l', 'r'])
assert.deepStrictEqual(f(E.left('r'))(E.right('l')), ['r', 'l'])
assert.deepStrictEqual(f(E.left('r'))(E.right('r')), ['r', 'r'])
```

Added in v0.17.0

## unsafeExpect

Unwrap the value from within an `Either`, throwing the inner value of `Left`
via `Show` if `Left`.

**Signature**

```ts
export declare const unsafeExpect: <E>(S: Show<E>) => <A>(x: Either<E, A>) => A
```

```hs
unsafeExpect :: Show e -> Either e a -> a
```

**Example**

```ts
import { unsafeExpect } from 'fp-ts-std/Either'
import * as E from 'fp-ts/Either'
import * as Str from 'fp-ts/string'

assert.throws(() => unsafeExpect(Str.Show)(E.left('foo')), /^"foo"$/)
```

Added in v0.16.0

## unsafeExpectLeft

Unwrap the value from within an `Either`, throwing the inner value of `Right`
via `Show` if `Right`.

**Signature**

```ts
export declare const unsafeExpectLeft: <A>(S: Show<A>) => <E>(x: Either<E, A>) => E
```

```hs
unsafeExpectLeft :: Show a -> Either e a -> e
```

**Example**

```ts
import { unsafeExpectLeft } from 'fp-ts-std/Either'
import * as E from 'fp-ts/Either'
import * as Str from 'fp-ts/string'

assert.throws(() => unsafeExpectLeft(Str.Show)(E.right('foo')), /^"foo"$/)
```

Added in v0.16.0

## unsafeUnwrap

Unwrap the value from within an `Either`, throwing the inner value of `Left`
if `Left`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: Either<unknown, A>) => A
```

```hs
unsafeUnwrap :: Either unknown a -> a
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/Either'
import * as E from 'fp-ts/Either'

assert.deepStrictEqual(unsafeUnwrap(E.right(5)), 5)
```

Added in v0.1.0

## unsafeUnwrapLeft

Unwrap the value from within an `Either`, throwing the inner value of `Right`
if `Right`.

**Signature**

```ts
export declare const unsafeUnwrapLeft: <E>(x: Either<E, unknown>) => E
```

```hs
unsafeUnwrapLeft :: Either e unknown -> e
```

**Example**

```ts
import { unsafeUnwrapLeft } from 'fp-ts-std/Either'
import * as E from 'fp-ts/Either'

assert.deepStrictEqual(unsafeUnwrapLeft(E.left(5)), 5)
```

Added in v0.5.0
