---
title: Option.ts
nav_order: 12
parent: Modules
---

## Option overview

Utility functions to accommodate `fp-ts/Option`.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [noneAs](#noneas)
  - [unsafeUnwrap](#unsafeunwrap)

---

# utils

## noneAs

A thunked `None` constructor. Enables specifying the type of the `Option`
without a type assertion. Helpful in certain circumstances in which type
inferrence isn't smart enough to unify with the `Option<never>` of the
standard `None` constructor.

**Signature**

```ts
export declare const noneAs: <A>() => Option<A>
```

```hs
noneAs :: () -> Option a
```

**Example**

```ts
import { noneAs } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(noneAs<any>(), O.none)
```

Added in v0.12.0

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
