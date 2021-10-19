---
title: Task.ts
nav_order: 19
parent: Modules
---

## Task overview

Utility functions to accommodate `fp-ts/Task`.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [elapsed](#elapsed)
  - [sleep](#sleep)

---

# utils

## elapsed

Calls the callback upon task completion with the number of milliseconds it
took for the task to complete. The task otherwise operates as per usual.

**Signature**

```ts
export declare const elapsed: (f: (n: Milliseconds) => IO<void>) => <A>(x: Task<A>) => Task<A>
```

```hs
elapsed :: (Milliseconds -> IO void) -> Task a -> Task a
```

**Example**

```ts
import { elapsed, sleep } from 'fp-ts-std/Task'
import * as D from 'fp-ts-std/Date'
import { gt } from 'fp-ts/Ord'

const wait = sleep(D.mkMilliseconds(10))
let time: D.Milliseconds
const waitAndTrackElapsed = elapsed((ms) => () => {
  time = ms
})(wait)

waitAndTrackElapsed().then(() => {
  assert.strictEqual(time !== undefined && gt(D.ordMilliseconds)(time, D.mkMilliseconds(0)), true)
})
```

Added in v0.5.0

## sleep

Wait for the specified number of milliseconds before resolving.

Like `fp-ts/Task::delay`, but doesn't run any underlying task; it simply
resolves with void. Can also be useful with async/await (`await sleep(n)()`).

**Signature**

```ts
export declare const sleep: (n: Milliseconds) => Task<void>
```

```hs
sleep :: Milliseconds -> Task void
```

**Example**

```ts
import { sleep } from 'fp-ts-std/Task'
import { mkMilliseconds } from 'fp-ts-std/Date'
import { sequenceT } from 'fp-ts/Apply'
import { pipe } from 'fp-ts/function'
import { Task } from 'fp-ts/Task'
import * as T from 'fp-ts/Task'

const xs: Array<string> = []

const append = (msg: string): Task<void> =>
  T.fromIO(() => {
    xs.push(msg)
  })

const instant = append('a')
const slowest = pipe(
  sleep(mkMilliseconds(10)),
  T.chain(() => append('b'))
)
const slow = pipe(
  sleep(mkMilliseconds(5)),
  T.chain(() => append('c'))
)

sequenceT(T.ApplicativePar)(instant, slowest, slow)().then(() => {
  assert.deepStrictEqual(xs, ['a', 'c', 'b'])
})
```

Added in v0.1.0
