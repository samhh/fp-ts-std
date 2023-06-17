---
title: TaskOption.ts
nav_order: 42
parent: Modules
---

## TaskOption overview

Utility functions to accommodate `fp-ts/TaskOption`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [2 Typeclass Methods](#2-typeclass-methods)
  - [pass](#pass)
- [3 Functions](#3-functions)
  - [unsafeExpect](#unsafeexpect)
  - [unsafeUnwrap](#unsafeunwrap)

---

# 2 Typeclass Methods

## pass

Convenient alias for `TO.of(undefined)`.

**Signature**

```ts
export declare const pass: TO.TaskOption<void>
```

**Example**

```ts
import { flow, pipe, constant } from 'fp-ts/function'
import * as Fn from 'fp-ts-std/Function'
import * as O from 'fp-ts/Option'
import Option = O.Option
import * as TO from 'fp-ts/TaskOption'
import TaskOption = TO.TaskOption
import { pass } from 'fp-ts-std/TaskOption'
import { log } from 'fp-ts/Console'

const mcount: Option<number> = O.some(123)
const tryAsyncLog: <A>(x: A) => TaskOption<void> = flow(log, TO.fromIO)

const logCount: TaskOption<void> = pipe(mcount, O.match(constant(pass), tryAsyncLog))
```

Added in v0.17.0

# 3 Functions

## unsafeExpect

Unwrap the promise from within a `TaskOption`, rejecting with `msg` if
`None`.

**Signature**

```ts
export declare const unsafeExpect: (msg: string) => <A>(x: TO.TaskOption<A>) => Promise<A>
```

**Example**

```ts
import { unsafeExpect } from 'fp-ts-std/TaskOption'
import * as TO from 'fp-ts/TaskOption'

assert.rejects(unsafeExpect('foo')(TO.none), Error('Unwrapped `None`'))
```

Added in v0.16.0

## unsafeUnwrap

Unwrap the promise from within a `TaskOption`, rejecting if `None`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: TO.TaskOption<A>) => Promise<A>
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
