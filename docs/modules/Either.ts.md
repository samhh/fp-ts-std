---
title: Either.ts
nav_order: 4
parent: Modules
---

## Either overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [unsafeUnwrap](#unsafeunwrap)

---

# utils

## unsafeUnwrap

Unwrap the value from within an `Either`, throwing if `Left`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: Either<unknown, A>) => A
```

Added in v0.1.0
