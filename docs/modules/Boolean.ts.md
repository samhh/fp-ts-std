---
title: Boolean.ts
nav_order: 2
parent: Modules
---

## Boolean overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [not](#not)

---

# utils

## not

Invert a predicate.

**Signature**

```ts
export declare const not: <A>(f: Predicate<A>) => Predicate<A>
```

**Example**

```ts
import { not } from 'fp-ts-std/Boolean'
import { Predicate } from 'fp-ts/function'

const isFive: Predicate<number> = (x) => x === 5
const isNotFive = not(isFive)

assert.strictEqual(isFive(5), true)
assert.strictEqual(isNotFive(5), false)
```

Added in v0.1.0
