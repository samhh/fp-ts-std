---
title: IOOption.ts
nav_order: 15
parent: Modules
---

## IOOption overview

Utility functions to accommodate `fp-ts/IOOption`.

Added in v0.16.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [unsafeExpect](#unsafeexpect)
  - [unsafeUnwrap](#unsafeunwrap)

---

# utils

## unsafeExpect

Unwrap the value from within an `IOOption`, throwing `msg` if `None`.

**Signature**

```ts
export declare const unsafeExpect: (msg: string) => <A>(x: IOOption<A>) => A
```

```hs
unsafeExpect :: string -> IOOption a -> a
```

**Example**

```ts
import { unsafeExpect } from 'fp-ts-std/IOOption'
import * as IOO from 'fp-ts/IOOption'

assert.throws(() => unsafeExpect('foo')(IOO.none), /^foo$/)
```

Added in v0.16.0

## unsafeUnwrap

Unwrap the value from within an `IOOption`, throwing if `None`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: IOOption<A>) => A
```

```hs
unsafeUnwrap :: IOOption a -> a
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/IOOption'
import * as IOO from 'fp-ts/IOOption'

assert.strictEqual(unsafeUnwrap(IOO.some(5)), 5)
```

Added in v0.16.0
