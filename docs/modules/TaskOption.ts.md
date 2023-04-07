---
title: TaskOption.ts
nav_order: 40
parent: Modules
---

## TaskOption overview

Utility functions to accommodate `fp-ts/TaskOption`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [unsafeUnwrap](#unsafeunwrap)

---

# utils

## unsafeUnwrap

Unwrap the promise from within a `TaskOption`, rejecting if `None`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: TaskOption<A>) => Promise<A>
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/TaskOption'
import * as TO from 'fp-ts/TaskOption'

unsafeUnwrap(TO.of(5)).then((x) => {
  assert.strictEqual(x, 5)
})
```

Added in v0.15.0
