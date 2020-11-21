---
title: IO.ts
nav_order: 8
parent: Modules
---

## IO overview

Added in v0.7.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [tap](#tap)

---

# utils

## tap

Performs the side effect with the input value and then returns said input
value.

**Signature**

```ts
export declare const tap: <A>(f: (x: A) => IO<void>) => (x: A) => IO<A>
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
