---
title: Monad.ts
nav_order: 18
parent: Modules
---

## Monad overview

Utility functions to accommodate `fp-ts/Monad`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [allPassM](#allpassm)
  - [andM](#andm)
  - [anyPassM](#anypassm)
  - [ifM](#ifm)
  - [nonePassM](#nonepassm)
  - [orM](#orm)

---

# utils

## allPassM

Monadic `allPass`. Short-circuits.

**Signature**

```ts
export declare function allPassM<M extends URIS4>(
  M: Monad4<M>
): <S, R, E, A>(f: Array<(x: A) => Kind4<M, S, R, E, boolean>>) => (x: A) => Kind4<M, S, R, E, boolean>
export declare function allPassM<M extends URIS3>(
  M: Monad3<M>
): <R, E, A>(f: Array<(x: A) => Kind3<M, R, E, boolean>>) => (x: A) => Kind3<M, R, E, boolean>
export declare function allPassM<M extends URIS3, E>(
  M: Monad3C<M, E>
): <R, A>(f: Array<(x: A) => Kind3<M, R, E, boolean>>) => (x: A) => Kind3<M, R, E, boolean>
export declare function allPassM<M extends URIS2>(
  M: Monad2<M>
): <E, A>(f: Array<(x: A) => Kind2<M, E, boolean>>) => (x: A) => Kind2<M, E, boolean>
export declare function allPassM<M extends URIS2, E>(
  M: Monad2C<M, E>
): <A>(f: Array<(x: A) => Kind2<M, E, boolean>>) => (x: A) => Kind2<M, E, boolean>
export declare function allPassM<M extends URIS>(
  M: Monad1<M>
): <A>(f: Array<(x: A) => Kind<M, boolean>>) => (x: A) => Kind<M, boolean>
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { allPassM } from 'fp-ts-std/Monad'
import * as IO from 'fp-ts/IO'
import { execute } from 'fp-ts-std/IO'

const f = allPassM(IO.Monad)

assert.strictEqual(execute(f([constant(IO.of(true)), constant(IO.of(true))])('foo')), true)
assert.strictEqual(execute(f([constant(IO.of(true)), constant(IO.of(false))])('foo')), false)
```

Added in v0.15.0

## andM

Monadic &&. Short-circuits.

**Signature**

```ts
export declare function andM<M extends URIS4>(
  M: Monad4<M>
): <S, R, E>(x: Kind4<M, S, R, E, boolean>) => (y: Kind4<M, S, R, E, boolean>) => Kind4<M, S, R, E, boolean>
export declare function andM<M extends URIS3>(
  M: Monad3<M>
): <R, E>(x: Kind3<M, R, E, boolean>) => (y: Kind3<M, R, E, boolean>) => Kind3<M, R, E, boolean>
export declare function andM<M extends URIS3, E>(
  M: Monad3C<M, E>
): <R>(x: Kind3<M, R, E, boolean>) => (y: Kind3<M, R, E, boolean>) => Kind3<M, R, E, boolean>
export declare function andM<M extends URIS2>(
  M: Monad2<M>
): <E>(x: Kind2<M, E, boolean>) => (y: Kind2<M, E, boolean>) => Kind2<M, E, boolean>
export declare function andM<M extends URIS2, E>(
  M: Monad2C<M, E>
): (x: Kind2<M, E, boolean>) => (y: Kind2<M, E, boolean>) => Kind2<M, E, boolean>
export declare function andM<M extends URIS>(
  M: Monad1<M>
): (x: Kind<M, boolean>) => (y: Kind<M, boolean>) => Kind<M, boolean>
```

**Example**

```ts
import { andM } from 'fp-ts-std/Monad'
import * as IO from 'fp-ts/IO'
import { execute } from 'fp-ts-std/IO'

const f = andM(IO.Monad)(IO.of(true))

assert.strictEqual(execute(f(IO.of(true))), true)
assert.strictEqual(execute(f(IO.of(false))), false)
```

Added in v0.15.0

## anyPassM

Monadic `anyPass`. Short-circuits.

**Signature**

```ts
export declare function anyPassM<M extends URIS4>(
  M: Monad4<M>
): <S, R, E, A>(f: Array<(x: A) => Kind4<M, S, R, E, boolean>>) => (x: A) => Kind4<M, S, R, E, boolean>
export declare function anyPassM<M extends URIS3>(
  M: Monad3<M>
): <R, E, A>(f: Array<(x: A) => Kind3<M, R, E, boolean>>) => (x: A) => Kind3<M, R, E, boolean>
export declare function anyPassM<M extends URIS3, E>(
  M: Monad3C<M, E>
): <R, A>(f: Array<(x: A) => Kind3<M, R, E, boolean>>) => (x: A) => Kind3<M, R, E, boolean>
export declare function anyPassM<M extends URIS2>(
  M: Monad2<M>
): <E, A>(f: Array<(x: A) => Kind2<M, E, boolean>>) => (x: A) => Kind2<M, E, boolean>
export declare function anyPassM<M extends URIS2, E>(
  M: Monad2C<M, E>
): <A>(f: Array<(x: A) => Kind2<M, E, boolean>>) => (x: A) => Kind2<M, E, boolean>
export declare function anyPassM<M extends URIS>(
  M: Monad1<M>
): <A>(f: Array<(x: A) => Kind<M, boolean>>) => (x: A) => Kind<M, boolean>
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { anyPassM } from 'fp-ts-std/Monad'
import * as IO from 'fp-ts/IO'
import { execute } from 'fp-ts-std/IO'

const f = anyPassM(IO.Monad)

assert.strictEqual(execute(f([constant(IO.of(true)), constant(IO.of(false))])('foo')), true)
assert.strictEqual(execute(f([constant(IO.of(false)), constant(IO.of(false))])('foo')), false)
```

Added in v0.15.0

## ifM

Monadic if/then/else. Only executes the relevant action.

**Signature**

```ts
export declare function ifM<M extends URIS4>(
  M: Monad4<M>
): <S, R, E>(
  p: Kind4<M, S, R, E, boolean>
) => <A>(x: Kind4<M, S, R, E, A>) => (y: Kind4<M, S, R, E, A>) => Kind4<M, S, R, E, A>
export declare function ifM<M extends URIS3>(
  M: Monad3<M>
): <R, E>(p: Kind3<M, R, E, boolean>) => <A>(x: Kind3<M, R, E, A>) => (y: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export declare function ifM<M extends URIS3, E>(
  M: Monad3C<M, E>
): <R>(p: Kind3<M, R, E, boolean>) => <A>(x: Kind3<M, R, E, A>) => (y: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export declare function ifM<M extends URIS2>(
  M: Monad2<M>
): <E>(p: Kind2<M, E, boolean>) => <A>(x: Kind2<M, E, A>) => (y: Kind2<M, E, A>) => Kind2<M, E, A>
export declare function ifM<M extends URIS2, E>(
  M: Monad2C<M, E>
): (p: Kind2<M, E, boolean>) => <A>(x: Kind2<M, E, A>) => (y: Kind2<M, E, A>) => Kind2<M, E, A>
export declare function ifM<M extends URIS>(
  M: Monad1<M>
): (p: Kind<M, boolean>) => <A>(x: Kind<M, A>) => (y: Kind<M, A>) => Kind<M, A>
```

**Example**

```ts
import { ifM } from 'fp-ts-std/Monad'
import * as IO from 'fp-ts/IO'
import { execute } from 'fp-ts-std/IO'

const f = ifM(IO.Monad)(IO.of(true))(IO.of('foo'))(IO.of('bar'))

assert.strictEqual(execute(f), 'foo')
```

Added in v0.15.0

## nonePassM

Monadic `nonePass`. Short-circuits.

**Signature**

```ts
export declare function nonePassM<M extends URIS4>(
  M: Monad4<M>
): <S, R, E, A>(f: Array<(x: A) => Kind4<M, S, R, E, boolean>>) => (x: A) => Kind4<M, S, R, E, boolean>
export declare function nonePassM<M extends URIS3>(
  M: Monad3<M>
): <R, E, A>(f: Array<(x: A) => Kind3<M, R, E, boolean>>) => (x: A) => Kind3<M, R, E, boolean>
export declare function nonePassM<M extends URIS3, E>(
  M: Monad3C<M, E>
): <R, A>(f: Array<(x: A) => Kind3<M, R, E, boolean>>) => (x: A) => Kind3<M, R, E, boolean>
export declare function nonePassM<M extends URIS2>(
  M: Monad2<M>
): <E, A>(f: Array<(x: A) => Kind2<M, E, boolean>>) => (x: A) => Kind2<M, E, boolean>
export declare function nonePassM<M extends URIS2, E>(
  M: Monad2C<M, E>
): <A>(f: Array<(x: A) => Kind2<M, E, boolean>>) => (x: A) => Kind2<M, E, boolean>
export declare function nonePassM<M extends URIS>(
  M: Monad1<M>
): <A>(f: Array<(x: A) => Kind<M, boolean>>) => (x: A) => Kind<M, boolean>
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { nonePassM } from 'fp-ts-std/Monad'
import * as IO from 'fp-ts/IO'
import { execute } from 'fp-ts-std/IO'

const f = nonePassM(IO.Monad)

assert.strictEqual(execute(f([constant(IO.of(false)), constant(IO.of(false))])('foo')), true)
assert.strictEqual(execute(f([constant(IO.of(false)), constant(IO.of(true))])('foo')), false)
```

Added in v0.15.0

## orM

Monadic ||. Short-circuits.

**Signature**

```ts
export declare function orM<M extends URIS4>(
  M: Monad4<M>
): <S, R, E>(x: Kind4<M, S, R, E, boolean>) => (y: Kind4<M, S, R, E, boolean>) => Kind4<M, S, R, E, boolean>
export declare function orM<M extends URIS3>(
  M: Monad3<M>
): <R, E>(x: Kind3<M, R, E, boolean>) => (y: Kind3<M, R, E, boolean>) => Kind3<M, R, E, boolean>
export declare function orM<M extends URIS3, E>(
  M: Monad3C<M, E>
): <R>(x: Kind3<M, R, E, boolean>) => (y: Kind3<M, R, E, boolean>) => Kind3<M, R, E, boolean>
export declare function orM<M extends URIS2>(
  M: Monad2<M>
): <E>(x: Kind2<M, E, boolean>) => (y: Kind2<M, E, boolean>) => Kind2<M, E, boolean>
export declare function orM<M extends URIS2, E>(
  M: Monad2C<M, E>
): (x: Kind2<M, E, boolean>) => (y: Kind2<M, E, boolean>) => Kind2<M, E, boolean>
export declare function orM<M extends URIS>(
  M: Monad1<M>
): (x: Kind<M, boolean>) => (y: Kind<M, boolean>) => Kind<M, boolean>
```

**Example**

```ts
import { orM } from 'fp-ts-std/Monad'
import * as IO from 'fp-ts/IO'
import { execute } from 'fp-ts-std/IO'

const f = orM(IO.Monad)(IO.of(false))

assert.strictEqual(execute(f(IO.of(true))), true)
assert.strictEqual(execute(f(IO.of(false))), false)
```

Added in v0.15.0
