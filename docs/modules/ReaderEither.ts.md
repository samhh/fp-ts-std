---
title: ReaderEither.ts
nav_order: 28
parent: Modules
---

## ReaderEither overview

Utility functions to accommodate `fp-ts/ReaderEither`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [runReaderEither](#runreadereither)

---

# utils

## runReaderEither

Runs a ReaderEither and extracts the final Either from it.

**Signature**

```ts
export declare const runReaderEither: <R, E, A>(r: R) => (reader: ReaderEither<R, E, A>) => Either<E, A>
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
