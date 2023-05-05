---
title: Random.ts
nav_order: 27
parent: Modules
---

## Random overview

Utilities to accommodate `fp-ts/Random`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [3 Functions](#3-functions)
  - [randomExtract](#randomextract)

---

# 3 Functions

## randomExtract

Like `fp-ts/Array::randomElem`, but returns the remainder of the array as
well.

**Signature**

```ts
export declare const randomExtract: <A>(xs: NonEmptyArray<A>) => IO<[A, A[]]>
```

```hs
randomExtract :: NonEmptyArray a -> IO [a, (Array a)]
```

**Example**

```ts
import { randomExtract } from 'fp-ts-std/Random'

assert.deepStrictEqual(randomExtract(['x'])(), ['x', []])
```

Added in v0.12.0
