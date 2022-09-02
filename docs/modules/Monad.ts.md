---
title: Monad.ts
nav_order: 17
parent: Modules
---

## Monad overview

Utility functions to accommodate `fp-ts/Monad`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [andM](#andm)
  - [ifM](#ifm)

---

# utils

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

```hs
andM :: m extends URIS4 => Monad4 m -> Kind4 m s r e boolean -> Kind4 m s r e boolean -> Kind4 m s r e boolean
andM :: m extends URIS3 => ((Monad3 m) -> Kind3 m r e boolean -> Kind3 m r e boolean -> Kind3 m r e boolean)
andM :: m extends URIS3 => ((Monad3C m e) -> Kind3 m r e boolean -> Kind3 m r e boolean -> Kind3 m r e boolean)
andM :: m extends URIS2 => ((Monad2 m) -> Kind2 m e boolean -> Kind2 m e boolean -> Kind2 m e boolean)
andM :: m extends URIS2 => ((Monad2C m e) -> Kind2 m e boolean -> Kind2 m e boolean -> Kind2 m e boolean)
andM :: m extends URIS => ((Monad1 m) -> Kind m boolean -> Kind m boolean -> Kind m boolean)
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { andM } from 'fp-ts-std/Monad'
import * as IO from 'fp-ts/IO'
import { execute } from 'fp-ts-std/IO'

const f = andM(IO.Monad)(IO.of(true))

assert.strictEqual(execute(f(IO.of(true))), true)
assert.strictEqual(execute(f(IO.of(false))), false)
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

```hs
ifM :: m extends URIS4 => Monad4 m -> Kind4 m s r e boolean -> Kind4 m s r e a -> Kind4 m s r e a -> Kind4 m s r e a
ifM :: m extends URIS3 => ((Monad3 m) -> Kind3 m r e boolean -> Kind3 m r e a -> Kind3 m r e a -> Kind3 m r e a)
ifM :: m extends URIS3 => ((Monad3C m e) -> Kind3 m r e boolean -> Kind3 m r e a -> Kind3 m r e a -> Kind3 m r e a)
ifM :: m extends URIS2 => ((Monad2 m) -> Kind2 m e boolean -> Kind2 m e a -> Kind2 m e a -> Kind2 m e a)
ifM :: m extends URIS2 => ((Monad2C m e) -> Kind2 m e boolean -> Kind2 m e a -> Kind2 m e a -> Kind2 m e a)
ifM :: m extends URIS => ((Monad1 m) -> Kind m boolean -> Kind m a -> Kind m a -> Kind m a)
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { ifM } from 'fp-ts-std/Monad'
import * as IO from 'fp-ts/IO'
import { execute } from 'fp-ts-std/IO'

const f = ifM(IO.Monad)(IO.of(true))(IO.of('foo'))(IO.of('bar'))

assert.strictEqual(execute(f), 'foo')
```

Added in v0.15.0
