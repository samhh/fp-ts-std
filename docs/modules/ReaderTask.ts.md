---
title: ReaderTask.ts
nav_order: 31
parent: Modules
---

## ReaderTask overview

Utility functions to accommodate `fp-ts/ReaderTask`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [3 Functions](#3-functions)
  - [asksTask](#askstask)
  - [runReaderTask](#runreadertask)

---

# 3 Functions

## asksTask

Effectfully accesses the environment outside of the `Reader` layer.

**Signature**

```ts
export declare const asksTask: <R, A>(f: (r: R) => Task<A>) => ReaderTask<R, A>
```

```hs
asksTask :: (r -> Task a) -> ReaderTask r a
```

**Example**

```ts
import { asksTask } from 'fp-ts-std/ReaderTask'

const lucky = asksTask<number, boolean>((n) => () => Promise.resolve(n === Date.now()))

assert.deepEqual(lucky(42)(), Promise.resolve(false))
```

Added in v0.16.0

## runReaderTask

Runs a ReaderTask and extracts the final Task from it.

**Signature**

```ts
export declare const runReaderTask: <R, A>(r: R) => (reader: ReaderTask<R, A>) => Task<A>
```

```hs
runReaderTask :: r -> ReaderTask r a -> Task a
```

**Example**

```ts
import { runReaderTask } from 'fp-ts-std/ReaderTask'
import { pipe } from 'fp-ts/lib/function'
import * as RT from 'fp-ts/lib/ReaderTask'

type Env = { dependency: string }
const env: Env = { dependency: 'dependency ' }
pipe(RT.of<Env, number>(1), runReaderTask(env))().then((extractedValue) => assert.strictEqual(extractedValue, 1))
```

Added in v0.15.0
