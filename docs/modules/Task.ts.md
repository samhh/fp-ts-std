---
title: Task.ts
nav_order: 12
parent: Modules
---

## Task overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [sleep](#sleep)

---

# utils

## sleep

Wait for the specified number of milliseconds before resolving.

Like `fp-ts/Task::delay`, but doesn't run any underlying task; it simply
resolves with void. Can also be useful with async/await (`await sleep(n)()`).

**Signature**

```ts
export declare const sleep: (ms: number) => Task<void>
```

**Example**

```ts
import { sleep } from 'fp-ts-std/Task'
import { sequenceT } from 'fp-ts/Apply'
import { pipe } from 'fp-ts/function'
import { Task } from 'fp-ts/Task'
import * as T from 'fp-ts/Task'

const xs: Array<string> = []

const append = (msg: string): Task<void> =>
  T.fromIO(() => {
    xs.push(msg)
  })

const instant1 = append('a')
const delayed = pipe(
  sleep(10),
  T.chain(() => append('b'))
)
const instant2 = append('c')

sequenceT(T.task)(instant1, delayed, instant2)().then(() => {
  assert.deepStrictEqual(xs, ['a', 'c', 'b'])
})
```

Added in v0.1.0
