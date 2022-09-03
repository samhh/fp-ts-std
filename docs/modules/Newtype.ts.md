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
