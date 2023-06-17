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

- [2 Typeclass Methods](#2-typeclass-methods)
  - [pass](#pass)
- [3 Functions](#3-functions)
  - [unsafeExpect](#unsafeexpect)
  - [unsafeUnwrap](#unsafeunwrap)

---

# 2 Typeclass Methods

## pass

Convenient alias for `IOO.of(undefined)`.

**Signature**

```ts
export declare const pass: IOO.IOOption<void>
```

**Example**

```ts
import { flow, pipe, constant } from 'fp-ts/function'
import * as Fn from 'fp-ts-std/Function'
import * as O from 'fp-ts/Option'
import Option = O.Option
import * as IOO from 'fp-ts/IOOption'
import IOOption = IOO.IOOption
import { pass } from 'fp-ts-std/IOOption'
import { log } from 'fp-ts/Console'

const mcount: Option<number> = O.some(123)
const tryLog: <A>(x: A) => IOOption<void> = flow(log, IOO.fromIO)

const logCount: IOOption<void> = pipe(mcount, O.match(constant(pass), tryLog))
```

Added in v0.17.0

# 3 Functions

## unsafeExpect

Unwrap the value from within an `IOOption`, throwing `msg` if `None`.

**Signature**

```ts
export declare const unsafeExpect: (msg: string) => <A>(x: IOO.IOOption<A>) => A
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
export declare const unsafeUnwrap: <A>(x: IOO.IOOption<A>) => A
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/IOOption'
import * as IOO from 'fp-ts/IOOption'

assert.strictEqual(unsafeUnwrap(IOO.some(5)), 5)
```

Added in v0.16.0
