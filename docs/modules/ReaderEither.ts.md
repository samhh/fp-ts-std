---
title: ReaderEither.ts
nav_order: 29
parent: Modules
---

## ReaderEither overview

Utility functions to accommodate `fp-ts/ReaderEither`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [asksEither](#askseither)
  - [runReaderEither](#runreadereither)

---

# utils

## asksEither

Effectfully accesses the environment outside of the `Reader` layer.

**Signature**

```ts
export declare const asksEither: <R, E, A>(f: (r: R) => Either<E, A>) => ReaderEither<R, E, A>
```

```hs
asksEither :: (r -> Either e a) -> ReaderEither r e a
```

**Example**

```ts
import { asksEither } from 'fp-ts-std/ReaderEither'
import * as E from 'fp-ts/Either'

const lucky = asksEither<number, unknown, boolean>((n) => E.right(n === Date.now()))

assert.deepStrictEqual(lucky(42), E.right(false))
```

Added in v0.16.0

## runReaderEither

Runs a ReaderEither and extracts the final Either from it.

**Signature**

```ts
export declare const runReaderEither: <R, E, A>(r: R) => (reader: ReaderEither<R, E, A>) => Either<E, A>
```

```hs
runReaderEither :: r -> ReaderEither r e a -> Either e a
```

**Example**

```ts
import { runReaderEither } from 'fp-ts-std/ReaderEither'
import { pipe } from 'fp-ts/function'
import * as RE from 'fp-ts/ReaderEither'
import * as E from 'fp-ts/Either'

type Env = { dependency: string }
const env: Env = { dependency: 'dependency' }

const extractedEither = pipe(E.right(1), RE.fromEither, runReaderEither(env))

assert.deepStrictEqual(extractedEither, E.right(1))
```

Added in v0.15.0
