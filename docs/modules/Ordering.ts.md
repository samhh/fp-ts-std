---
title: Ordering.ts
nav_order: 25
parent: Modules
---

## Ordering overview

Utilities to accommodate `fp-ts/Ordering`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [3 Functions](#3-functions)
  - [EQ](#eq)
  - [GT](#gt)
  - [LT](#lt)

---

# 3 Functions

## EQ

Alias for the notion of "equal to" in `Ordering`.

**Signature**

```ts
export declare const EQ: Ordering
```

```hs
EQ :: Ordering
```

**Example**

```ts
import { Ord } from 'fp-ts/number'
import { EQ } from 'fp-ts-std/Ordering'

assert.strictEqual(Ord.compare(0, 0), EQ)
```

Added in v0.12.0

## GT

Alias for the notion of "greater than" in `Ordering`.

**Signature**

```ts
export declare const GT: Ordering
```

```hs
GT :: Ordering
```

**Example**

```ts
import { Ord } from 'fp-ts/number'
import { GT } from 'fp-ts-std/Ordering'

assert.strictEqual(Ord.compare(1, 0), GT)
```

Added in v0.12.0

## LT

Alias for the notion of "less than" in `Ordering`.

**Signature**

```ts
export declare const LT: Ordering
```

```hs
LT :: Ordering
```

**Example**

```ts
import { Ord } from 'fp-ts/number'
import { LT } from 'fp-ts-std/Ordering'

assert.strictEqual(Ord.compare(0, 1), LT)
```

Added in v0.12.0
