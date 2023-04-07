---
title: ReaderTaskEither.ts
nav_order: 32
parent: Modules
---

## ReaderTaskEither overview

Utility functions to accommodate `fp-ts/ReaderTaskEither`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [asksTask](#askstask)
  - [asksTaskEither](#askstaskeither)
  - [runReaderTaskEither](#runreadertaskeither)
  - [unsafeUnwrap](#unsafeunwrap)
  - [unsafeUnwrapLeft](#unsafeunwrapleft)

---

# utils

## asksTask

Effectfully accesses the environment outside of the `Reader` and `Either`
layers.

**Signature**

```ts
export declare const asksTask: <R, E, A>(f: (r: R) => Task<A>) => RTE.ReaderTaskEither<R, E, A>
```

**Example**

```ts
import { asksTask } from 'fp-ts-std/ReaderTaskEither'
import * as E from 'fp-ts/Either'

const lucky = asksTask<number, unknown, boolean>((n) => () => Promise.resolve(n === Date.now()))

assert.deepEqual(lucky(42)(), Promise.resolve(E.right(false)))
```

Added in v0.16.0

## asksTaskEither

Effectfully accesses the environment outside of the `Reader` layer.

**Signature**

```ts
export declare const asksTaskEither: <R, E, A>(f: (r: R) => TE.TaskEither<E, A>) => RTE.ReaderTaskEither<R, E, A>
```

**Example**

```ts
import { asksTaskEither } from 'fp-ts-std/ReaderTaskEither'
import * as E from 'fp-ts/Either'

const lucky = asksTaskEither<number, unknown, boolean>((n) => () => Promise.resolve(E.right(n === Date.now())))

assert.deepEqual(lucky(42)(), Promise.resolve(E.right(false)))
```

Added in v0.16.0

## runReaderTaskEither

Runs a ReaderTaskEither and extracts the final TaskEither from it.

**Signature**

```ts
export declare const runReaderTaskEither: <R, E, A>(
  r: R
) => (reader: RTE.ReaderTaskEither<R, E, A>) => TE.TaskEither<E, A>
```

**Example**

```ts
import { runReaderTaskEither } from 'fp-ts-std/ReaderTaskEither'
import { pipe } from 'fp-ts/function'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as E from 'fp-ts/Either'

type Env = { dependency: string }
const env: Env = { dependency: 'dependency' }
pipe(E.right(1), RTE.fromEither, runReaderTaskEither(env))().then((extractedValue) =>
  assert.deepStrictEqual(extractedValue, E.right(1))
)
```

Added in v0.15.0

## unsafeUnwrap

Unwrap the promise from within a `ReaderTaskEither`, rejecting with the inner
value of `Left` if `Left`.

**Signature**

```ts
export declare const unsafeUnwrap: <R, A>(rte: RTE.ReaderTaskEither<R, unknown, A>) => (r: R) => Promise<A>
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/ReaderTaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'

unsafeUnwrap(RTE.right(5))({}).then((x) => {
  assert.strictEqual(x, 5)
})
```

Added in v0.15.0

## unsafeUnwrapLeft

Unwrap the promise from within a `ReaderTaskEither`, throwing the inner
value of `Right` if `Right`.

**Signature**

```ts
export declare const unsafeUnwrapLeft: <R, E>(rte: RTE.ReaderTaskEither<R, E, unknown>) => (r: R) => Promise<E>
```

**Example**

```ts
import { unsafeUnwrapLeft } from 'fp-ts-std/ReaderTaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'

unsafeUnwrapLeft(RTE.left(5))({}).then((x) => {
  assert.strictEqual(x, 5)
})
```

Added in v0.15.0
