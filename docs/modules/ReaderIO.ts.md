---
title: ReaderIO.ts
nav_order: 30
parent: Modules
---

## ReaderIO overview

Utility functions to accommodate `fp-ts/ReaderIO`.

Added in v0.16.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [runReaderIO](#runreaderio)

---

# utils

## runReaderIO

Runs a `ReaderIO` and extracts the final `IO` from it.

**Signature**

```ts
export declare const runReaderIO: <R, A>(r: R) => (m: ReaderIO<R, A>) => IO<A>
```

```hs
runReaderIO :: r -> ReaderIO r a -> IO a
```

**Example**

```ts
import { runReaderIO } from 'fp-ts-std/ReaderIO'
import { pipe } from 'fp-ts/function'
import * as RIO from 'fp-ts/ReaderIO'

assert.strictEqual(pipe(RIO.of<string, number>(123), runReaderIO('env'))(), 123)
```

Added in v0.16.0
