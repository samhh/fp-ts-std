---
title: TaskEither.ts
nav_order: 34
parent: Modules
---

## TaskEither overview

Utility functions to accommodate `fp-ts/TaskEither`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [mapBoth](#mapboth)
  - [unsafeUnwrap](#unsafeunwrap)
  - [unsafeUnwrapLeft](#unsafeunwrapleft)

---

# utils

## mapBoth

Apply a function to both elements of an `TaskEither`.

**Signature**

```ts
export declare const mapBoth: <A, B>(f: (x: A) => B) => (xs: TaskEither<A, A>) => TaskEither<B, B>
```

```hs
mapBoth :: (a -> b) -> TaskEither a a -> TaskEither b b
```

**Example**

```ts
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { mapBoth } from 'fp-ts-std/TaskEither'
import { multiply } from 'fp-ts-std/Number'

const f = mapBoth(multiply(2))

f(TE.left(3))().then((x) => {
  assert.deepStrictEqual(x, E.left(6))
})
f(TE.right(3))().then((x) => {
  assert.deepStrictEqual(x, E.right(6))
})
```

Added in v0.14.0

## unsafeUnwrap

Unwrap the promise from within a `TaskEither`, rejecting with the inner
value of `Left` if `Left`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: TaskEither<unknown, A>) => Promise<A>
```

```hs
unsafeUnwrap :: TaskEither unknown a -> Promise a
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/TaskEither'
import * as TE from 'fp-ts/TaskEither'

unsafeUnwrap(TE.right(5)).then((x) => {
  assert.strictEqual(x, 5)
})
```

Added in v0.12.0

## unsafeUnwrapLeft

Unwrap the promise from within a `TaskEither`, throwing the inner value of
`Right` if `Right`.

**Signature**

```ts
export declare const unsafeUnwrapLeft: <E>(x: TaskEither<E, unknown>) => Promise<E>
```

```hs
unsafeUnwrapLeft :: TaskEither e unknown -> Promise e
```

**Example**

```ts
import { unsafeUnwrapLeft } from 'fp-ts-std/TaskEither'
import * as TE from 'fp-ts/TaskEither'

unsafeUnwrapLeft(TE.left(5)).then((x) => {
  assert.strictEqual(x, 5)
})
```

Added in v0.12.0
