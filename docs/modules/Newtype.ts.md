---
title: Newtype.ts
nav_order: 19
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
  - [pack](#pack)
  - [unpack](#unpack)

---

# utils

## over

Convert an endomorphism on the type beneath a newtype to an endomorphism on
the newtype itself.

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
