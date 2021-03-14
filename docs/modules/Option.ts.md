---
title: Option.ts
nav_order: 12
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

```hs
unsafeUnwrap :: Option a -> a
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(unsafeUnwrap(O.some(5)), 5)
```

Added in v0.1.0
