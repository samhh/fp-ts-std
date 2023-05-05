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

- [3 Functions](#3-functions)
  - [asksIO](#asksio)
  - [runReaderIO](#runreaderio)

---

# 3 Functions

## asksIO

Effectfully accesses the environment outside of the `Reader` layer.

**Signature**

```ts
export declare const asksIO: <R, A>(f: (r: R) => IO<A>) => ReaderIO<R, A>
```

```hs
asksIO :: (r -> IO a) -> ReaderIO r a
```

**Example**

```ts
import { asksIO } from 'fp-ts-std/ReaderIO'

const lucky = asksIO<number, boolean>((n) => () => n === Date.now())

assert.strictEqual(lucky(42)(), false)
```

Added in v0.16.0

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
