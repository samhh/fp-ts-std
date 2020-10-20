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
  - [complement](#complement)
  - [not](#not)

---

# utils

## complement

Invert a predicate.

**Signature**

```ts
export declare const complement: <A>(f: Predicate<A>) => Predicate<A>
```

**Example**

```ts
import { complement } from 'fp-ts-std/Boolean'
import { Predicate } from 'fp-ts/function'

const isFive: Predicate<number> = (x) => x === 5
const isNotFive = complement(isFive)

assert.strictEqual(isFive(5), true)
assert.strictEqual(isNotFive(5), false)
```

Added in v0.4.0

## not

Invert a boolean.

**Signature**

```ts
export declare const not: Endomorphism<boolean>
```

Added in v0.4.0
