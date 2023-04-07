---
title: TaskOption.ts
nav_order: 41
parent: Modules
---

## TaskOption overview

Utility functions to accommodate `fp-ts/TaskOption`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [unsafeExpect](#unsafeexpect)
  - [unsafeUnwrap](#unsafeunwrap)

---

# utils

## unsafeExpect

Unwrap the promise from within a `TaskOption`, rejecting with `msg` if
`None`.

**Signature**

```ts
export declare const unsafeExpect: (msg: string) => <A>(x: TaskOption<A>) => Promise<A>
```

```hs
unsafeExpect :: string -> TaskOption a -> Promise a
```

**Example**

```ts
import { unsafeExpect } from 'fp-ts-std/TaskOption'
import * as TO from 'fp-ts/TaskOption'

assert.rejects(unsafeExpect('foo')(TO.none), /^foo$/)
```

Added in v0.16.0

## unsafeUnwrap

Unwrap the promise from within a `TaskOption`, rejecting if `None`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: TaskOption<A>) => Promise<A>
```

```hs
unsafeUnwrap :: TaskOption a -> Promise a
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
