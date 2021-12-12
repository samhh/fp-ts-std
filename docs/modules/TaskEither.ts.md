---
title: TaskEither.ts
nav_order: 27
parent: Modules
---

## TaskEither overview

Utility functions to accommodate `fp-ts/TaskEither`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [unsafeUnwrap](#unsafeunwrap)
  - [unsafeUnwrapLeft](#unsafeunwrapleft)

---

# utils

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
