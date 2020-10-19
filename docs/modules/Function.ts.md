---
title: Function.ts
nav_order: 6
parent: Modules
---

## Function overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [flip](#flip)

---

# utils

## flip

Flip the function/argument order of a curried function.

Note that due to limitations to the type system, this function won't work
correctly for curried functions.

**Signature**

```ts
export declare const flip: <A extends any[], B extends any[], C>(
  f: (...a: A) => (...b: B) => C
) => (...b: B) => (...a: A) => C
```

Added in v0.1.0
