---
title: Newtype.ts
nav_order: 21
parent: Modules
---

## Newtype overview

Polymorphic functions for `newtype-ts`.

**Warning**: These functions will allow you to break the contracts of
newtypes behind smart constructors.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [over](#over)
  - [overF](#overf)
  - [pack](#pack)
  - [unpack](#unpack)

---

# utils

## over

Apply an endomorphism over a newtype. Similar to functor map, but for
newtypes.

**Signature**

```ts
export declare const over: <A>(f: Endomorphism<A>) => <B extends Newtype<unknown, A>>(x: B) => B
```

```hs
over :: b extends (Newtype unknown a) => Endomorphism a -> b -> b
```

**Example**

```ts
import { over } from 'fp-ts-std/Newtype'
import { mkMilliseconds } from 'fp-ts-std/Date'
import { multiply } from 'fp-ts-std/Number'

assert.strictEqual(over(multiply(2))(mkMilliseconds(3)), mkMilliseconds(6))
```

Added in v0.15.0

## overF

Apply a effectful function over a newtype.

**Signature**

```ts
export declare function overF<F extends URIS4>(
  F: Functor4<F>
): <S, R, E, A>(f: (x: A) => Kind4<F, S, R, E, A>) => <B extends Newtype<unknown, A>>(x: B) => Kind4<F, S, R, E, B>
export declare function overF<F extends URIS3>(
  F: Functor3<F>
): <R, E, A>(f: (x: A) => Kind3<F, R, E, A>) => <B extends Newtype<unknown, A>>(x: B) => Kind3<F, R, E, B>
export declare function overF<F extends URIS2>(
  F: Functor2<F>
): <E, A>(f: (x: A) => Kind2<F, E, A>) => <B extends Newtype<unknown, A>>(x: B) => Kind2<F, E, B>
export declare function overF<F extends URIS>(
  F: Functor1<F>
): <A>(f: (x: A) => Kind<F, A>) => <B extends Newtype<unknown, A>>(x: B) => Kind<F, B>
export declare function overF<F>(
  F: Functor<F>
): <A>(f: (x: A) => HKT<F, A>) => <B extends Newtype<unknown, A>>(x: B) => HKT<F, B>
```

```hs
overF :: f extends URIS4, b extends (Newtype unknown a) => Functor4 f -> (a -> Kind4 f s r e a) -> b -> Kind4 f s r e b
overF :: f extends URIS3, b extends (Newtype unknown a) => Functor3 f -> (a -> Kind3 f r e a) -> b -> Kind3 f r e b
overF :: f extends URIS2, b extends (Newtype unknown a) => Functor2 f -> (a -> Kind2 f e a) -> b -> Kind2 f e b
overF :: f extends URIS, b extends (Newtype unknown a) => Functor1 f -> (a -> Kind f a) -> b -> Kind f b
overF :: b extends (Newtype unknown a) => Functor f -> (a -> HKT f a) -> b -> HKT f b
```

**Example**

```ts
import { overF } from 'fp-ts-std/Newtype'
import * as O from 'fp-ts/Option'
import { Milliseconds, mkMilliseconds } from 'fp-ts-std/Date'

const filterLongEnough =
  overF(O.Functor)<number>(O.fromPredicate((n) => n > 1000)) <
  Milliseconds >
  assert.deepStrictEqual(filterLongEnough(mkMilliseconds(500)), O.none)
assert.deepStrictEqual(filterLongEnough(mkMilliseconds(1500)), O.some(mkMilliseconds(1500)))
```

Added in v0.15.0

## pack

Pack a value into a newtype.

**Signature**

```ts
export declare const pack: <A extends Newtype<unknown, unknown> = never>(x: A['_A']) => A
```

```hs
pack :: a extends (Newtype unknown unknown) => a["_A"] -> a
```

**Example**

```ts
import { pack } from 'fp-ts-std/Newtype'
import { Milliseconds, mkMilliseconds } from 'fp-ts-std/Date'

assert.strictEqual(pack<Milliseconds>(123), mkMilliseconds(123))
```

Added in v0.15.0

## unpack

Unpack a value from a newtype.

**Signature**

```ts
export declare const unpack: <A extends Newtype<unknown, unknown>>(x: A) => A['_A']
```

```hs
unpack :: a extends (Newtype unknown unknown) => a -> a["_A"]
```

**Example**

```ts
import { unpack } from 'fp-ts-std/Newtype'
import { mkMilliseconds } from 'fp-ts-std/Date'

assert.strictEqual(unpack(mkMilliseconds(123)), 123)
```

Added in v0.15.0
