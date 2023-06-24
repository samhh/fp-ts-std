---
title: Task.ts
nav_order: 40
parent: Modules
---

## Task overview

Utility functions to accommodate `fp-ts/Task`.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [2 Typeclass Methods](#2-typeclass-methods)
  - [pass](#pass)
  - [sequenceArray\_](#sequencearray_)
  - [sequenceSeqArray\_](#sequenceseqarray_)
  - [traverseArray\_](#traversearray_)
  - [traverseSeqArray\_](#traverseseqarray_)
  - [unless](#unless)
  - [until](#until)
  - [when](#when)
- [3 Functions](#3-functions)
  - [elapsed](#elapsed)
  - [execute](#execute)
  - [sleep](#sleep)

---

# 2 Typeclass Methods

## pass

Convenient alias for `T.of(undefined)`.

**Signature**

```ts
export declare const pass: Task<void>
```

```hs
pass :: Task void
```

**Example**

```ts
import { flow, pipe, constant } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import Task = T.Task
import { pass } from 'fp-ts-std/Task'
import * as O from 'fp-ts/Option'
import Option = O.Option
import { log } from 'fp-ts/Console'

const mcount: Option<number> = O.some(123)
const asyncLog: <A>(x: A) => Task<void> = flow(log, T.fromIO)

const logCount: Task<void> = pipe(mcount, O.match(constant(pass), asyncLog))
```

Added in v0.17.0

## sequenceArray\_

Sequence an array of tasks, ignoring the results.

**Signature**

```ts
export declare const sequenceArray_: <A>(xs: readonly Task<A>[]) => Task<void>
```

```hs
sequenceArray_ :: Array (Task a) -> Task void
```

Added in v0.15.0

## sequenceSeqArray\_

Sequentially sequence an array of tasks, ignoring the results.

**Signature**

```ts
export declare const sequenceSeqArray_: <A>(xs: readonly Task<A>[]) => Task<void>
```

```hs
sequenceSeqArray_ :: Array (Task a) -> Task void
```

Added in v0.15.0

## traverseArray\_

Map to and sequence an array of tasks, ignoring the results.

**Signature**

```ts
export declare const traverseArray_: <A, B>(f: (x: A) => Task<B>) => (xs: readonly A[]) => Task<void>
```

```hs
traverseArray_ :: (a -> Task b) -> Array a -> Task void
```

Added in v0.15.0

## traverseSeqArray\_

Sequentially map to and sequence an array of tasks, ignoring the results.

**Signature**

```ts
export declare const traverseSeqArray_: <A, B>(f: (x: A) => Task<B>) => (xs: readonly A[]) => Task<void>
```

```hs
traverseSeqArray_ :: (a -> Task b) -> Array a -> Task void
```

Added in v0.15.0

## unless

The reverse of `when`.

**Signature**

```ts
export declare const unless: (x: boolean) => Endomorphism<Task<void>>
```

```hs
unless :: boolean -> Endomorphism (Task void)
```

**Example**

```ts
import { flow, pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/Predicate'
import { unless } from 'fp-ts-std/Task'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { log } from 'fp-ts/Console'

const logAsync = flow(log, T.fromIO)
const isValid: Predicate<number> = (n) => n === 42

pipe(
  TE.of(123),
  TE.chainFirstTaskK((n) => unless(isValid(n))(logAsync(n)))
)
```

Added in v0.12.0

## until

Repeatedly execute an asynchronous effect until the result satisfies the predicate.

**Signature**

```ts
export declare const until: <A>(p: Predicate<A>) => Endomorphism<Task<A>>
```

```hs
until :: Predicate a -> Endomorphism (Task a)
```

**Example**

```ts
import { until, execute } from 'fp-ts-std/Task'
import * as T from 'fp-ts/Task'
import Task = T.Task
import { Predicate } from 'fp-ts/Predicate'
import * as Rand from 'fp-ts/Random'

const isValid: Predicate<number> = (n) => n > 0.5

const genValidAsync: Task<number> = until(isValid)(T.fromIO(Rand.random))

async function test() {
  assert.strictEqual(isValid(await execute(genValidAsync)), true)
}

test()
```

Added in v0.18.0

## when

Conditional execution of a `Task`. Helpful for things like asychronous
logging.

**Signature**

```ts
export declare const when: (x: boolean) => Endomorphism<Task<void>>
```

```hs
when :: boolean -> Endomorphism (Task void)
```

**Example**

```ts
import { flow, pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/Predicate'
import { when } from 'fp-ts-std/Task'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { log } from 'fp-ts/Console'

const logAsync = flow(log, T.fromIO)
const isInvalid: Predicate<number> = (n) => n !== 42

pipe(
  TE.of(123),
  TE.chainFirstTaskK((n) => when(isInvalid(n))(logAsync(n)))
)
```

Added in v0.12.0

# 3 Functions

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

## execute

Execute a `Task`, returning the `Promise` within. Helpful for staying within
function application and composition pipelines.

**Signature**

```ts
export declare const execute: <A>(x: Task<A>) => Promise<A>
```

```hs
execute :: Task a -> Promise a
```

**Example**

```ts
import { execute } from 'fp-ts-std/Task'
import * as T from 'fp-ts/Task'

execute(T.of(5)).then((x) => {
  assert.strictEqual(x, 5)
})
```

Added in v0.12.0

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
