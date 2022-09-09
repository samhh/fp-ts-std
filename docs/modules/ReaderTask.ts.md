---
title: ReaderTask.ts
nav_order: 29
parent: Modules
---

## ReaderTask overview

Utility functions to accommodate `fp-ts/ReaderTask`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [runReaderTask](#runreadertask)

---

# utils

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
import { pipe } from 'fp-ts/function'
import * as RT from 'fp-ts/ReaderTask'

type Env = { dependency: string }
const env: Env = { dependency: 'dependency ' }
pipe(RT.of<Env, number>(1), runReaderTask(env))().then((extractedValue) => assert.strictEqual(extractedValue, 1))
```

Added in v0.15.0
