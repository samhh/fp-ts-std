---
title: Option.ts
nav_order: 10
parent: Modules
---

## Option overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [unsafeUnwrap](#unsafeunwrap)

---

# utils

## unsafeUnwrap

Unwrap the value from within an `Option`, throwing if `None`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: Option<A>) => A
```

Added in v0.1.0
