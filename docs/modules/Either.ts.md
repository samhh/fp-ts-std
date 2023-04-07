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

## unsafeUnwrap

Unwrap the value from within an `Either`, throwing the inner value of `Left`
if `Left`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: Either<unknown, A>) => A
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

**Example**

```ts
import { unsafeUnwrapLeft } from 'fp-ts-std/Either'
import * as E from 'fp-ts/Either'

assert.deepStrictEqual(unsafeUnwrapLeft(E.left(5)), 5)
```

Added in v0.5.0
