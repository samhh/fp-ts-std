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
  - [unsafeUnwrap](#unsafeunwrap)
  - [unsafeUnwrapLeft](#unsafeunwrapleft)

---

# utils

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
