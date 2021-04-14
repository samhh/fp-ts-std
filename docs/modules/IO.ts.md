---
title: IO.ts
nav_order: 9
parent: Modules
---

## IO overview

Utility functions to accommodate `fp-ts/IO`.

Added in v0.7.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [once](#once)
  - [tap](#tap)

---

# utils

## once

Given a function, returns a new function that always returns the output
value of its first invocation.

**Signature**

```ts
export declare const once: <A, B>(f: (x: A) => B) => (x: A) => IO<B>
```

```hs
once :: (a -> b) -> a -> IO b
```

**Example**

```ts
import { once } from 'fp-ts-std/IO'
import * as IO from 'fp-ts/IO'
import { add } from 'fp-ts-std/Number'

const f = once(add(5))

assert.strictEqual(f(2)(), 7)
assert.strictEqual(f(3)(), 7)
```

Added in v0.7.0

## tap

Performs the side effect with the input value and then returns said input
value.

**Signature**

```ts
export declare const tap: <A>(f: (x: A) => IO<void>) => (x: A) => IO<A>
```

```hs
tap :: (a -> IO void) -> a -> IO a
```

**Example**

```ts
import { tap } from 'fp-ts-std/IO'
import * as IO from 'fp-ts/IO'
import { flow } from 'fp-ts/function'

let x = 0
const mutate = (y: number): IO.IO<void> => () => {
  x = y
}

const double = (n: number): number => n * 2
const toString = (n: number): string => String(n)

const doubledString: (n: number) => IO.IO<string> = flow(double, tap(mutate), IO.map(toString))

assert.strictEqual(x, 0)
assert.strictEqual(doubledString(2)(), '4')
assert.strictEqual(x, 4)
```

Added in v0.7.0
