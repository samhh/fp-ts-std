---
title: Reader.ts
nav_order: 28
parent: Modules
---

## Reader overview

Utility functions to accommodate `fp-ts/Reader`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [3 Functions](#3-functions)
  - [runReader](#runreader)

---

# 3 Functions

## runReader

Runs a Reader and extracts the final value from it.

**Signature**

```ts
export declare const runReader: <R, A>(r: R) => (reader: Reader<R, A>) => A
```

```hs
runReader :: r -> Reader r a -> a
```

**Example**

```ts
import { runReader } from 'fp-ts-std/Reader'
import { pipe } from 'fp-ts/lib/function'
import * as R from 'fp-ts/Reader'

type Env = { dependency: string }
const env: Env = { dependency: 'dependency ' }
const extractedValue = pipe(R.of<Env, number>(1), runReader(env))
assert.strictEqual(extractedValue, 1)
```

Added in v0.15.0
