---
title: Debug.ts
nav_order: 4
parent: Modules
---

## Debug overview

Helpers for debugging applications during development. These should be
assumed to be unsafe and shouldn't make their way into production code.

Added in v0.2.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [trace](#trace)
  - [traceWithValue](#tracewithvalue)

---

# utils

## trace

Log the provided string to the console and immediately return the generic
argument. This is useful in the middle of `pipe`/`flow` chains.

The trace function should only be used for debugging. The function is not
referentially transparent: its type indicates that it is a pure function but
it has the side effect of outputting the trace message.

**Signature**

```ts
export declare const trace: (msg: string) => <A>(x: A) => A
```

Added in v0.2.0

## traceWithValue

Like `trace`, but logs the generic value too.

**Signature**

```ts
export declare const traceWithValue: (msg: string) => <A>(x: A) => A
```

Added in v0.2.0
