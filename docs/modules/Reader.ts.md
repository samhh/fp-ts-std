---
title: Reader.ts
nav_order: 27
parent: Modules
---

## Reader overview

Utility functions to accommodate `fp-ts/Reader`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [runReader](#runreader)

---

# utils

## runReader

Runs a Reader and extracts the final value from it.

**Signature**

```ts
export declare const runReader: <R, A>(r: R) => (reader: Reader<R, A>) => A
```

**Example**

```ts
import { runReader } from 'fp-ts-std/Reader'
import { pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Reader'

type Env = { dependency: string }
const env: Env = { dependency: 'dependency ' }
const extractedValue = pipe(R.of<Env, number>(1), runReader(env))
assert.strictEqual(extractedValue, 1)
```

Added in v0.15.0
