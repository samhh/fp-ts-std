---
title: IOEither.ts
nav_order: 14
parent: Modules
---

## IOEither overview

Utility functions to accommodate `fp-ts/IOEither`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [mapBoth](#mapboth)
  - [sequenceArray\_](#sequencearray_)
  - [traverseArray\_](#traversearray_)
  - [unsafeUnwrap](#unsafeunwrap)
  - [unsafeUnwrapLeft](#unsafeunwrapleft)

---

# utils

## mapBoth

Apply a function to both elements of an `IOEither`.

**Signature**

```ts
export declare const mapBoth: <A, B>(f: (x: A) => B) => (xs: IOEither<A, A>) => IOEither<B, B>
```

**Example**

```ts
import * as IOE from 'fp-ts/IOEither'
import * as E from 'fp-ts/Either'
import { mapBoth } from 'fp-ts-std/IOEither'
import { multiply } from 'fp-ts-std/Number'

const f = mapBoth(multiply(2))

assert.deepStrictEqual(f(IOE.left(3))(), E.left(6))
assert.deepStrictEqual(f(IOE.right(3))(), E.right(6))
```

Added in v0.15.0

## sequenceArray\_

Sequence an array of fallible effects, ignoring the results.

**Signature**

```ts
export declare const sequenceArray_: <E, A>(xs: readonly IOEither<E, A>[]) => IOEither<E, void>
```

Added in v0.15.0

## traverseArray\_

Map to and sequence an array of fallible effects, ignoring the results.

**Signature**

```ts
export declare const traverseArray_: <E, A, B>(f: (x: A) => IOEither<E, B>) => (xs: readonly A[]) => IOEither<E, void>
```

Added in v0.15.0

## unsafeUnwrap

Unwrap the value from within an `IOEither`, throwing with the inner value of
`Left` if `Left`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: IOEither<unknown, A>) => A
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/IOEither'
import * as IOE from 'fp-ts/IOEither'

assert.strictEqual(unsafeUnwrap(IOE.right(5)), 5)
```

Added in v0.15.0

## unsafeUnwrapLeft

Unwrap the value from within an `IOEither`, throwing the inner value of
`Right` if `Right`.

**Signature**

```ts
export declare const unsafeUnwrapLeft: <E>(x: IOEither<E, unknown>) => E
```

**Example**

```ts
import { unsafeUnwrapLeft } from 'fp-ts-std/IOEither'
import * as IOE from 'fp-ts/IOEither'

assert.strictEqual(unsafeUnwrapLeft(IOE.left(5)), 5)
```

Added in v0.15.0
