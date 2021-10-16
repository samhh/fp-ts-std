---
title: Tuple.ts
nav_order: 18
parent: Modules
---

## Tuple overview

Various functions to aid in working with tuples.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [toFst](#tofst)
  - [toSnd](#tosnd)

---

# utils

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
