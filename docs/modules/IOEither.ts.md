---
title: IOEither.ts
nav_order: 14
parent: Modules
---

## IOEither overview

Utility functions to accommodate `fp-ts/IOEither`.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [2 Typeclass Methods](#2-typeclass-methods)
  - [pass](#pass)
  - [sequenceArray\_](#sequencearray_)
  - [traverseArray\_](#traversearray_)
- [3 Functions](#3-functions)
  - [unsafeExpect](#unsafeexpect)
  - [unsafeExpectLeft](#unsafeexpectleft)
  - [unsafeUnwrap](#unsafeunwrap)
  - [unsafeUnwrapLeft](#unsafeunwrapleft)

---

# 2 Typeclass Methods

## pass

Convenient alias for `IOE.of(undefined)`.

**Signature**

```ts
export declare const pass: IOEither<unknown, void>
```

```hs
pass :: IOEither unknown void
```

**Example**

```ts
import { flow, pipe, constant } from 'fp-ts/function'
import * as Fn from 'fp-ts-std/Function'
import * as O from 'fp-ts/Option'
import Option = O.Option
import * as IOE from 'fp-ts/IOEither'
import IOEither = IOE.IOEither
import { pass } from 'fp-ts-std/IOEither'
import { log } from 'fp-ts/Console'

const mcount: Option<number> = O.some(123)
const tryLog: <A>(x: A) => IOEither<unknown, void> = flow(log, IOE.fromIO)

const logCount: IOEither<unknown, void> = pipe(mcount, O.match(constant(pass), tryLog))
```

Added in v0.17.0

## sequenceArray\_

Sequence an array of fallible effects, ignoring the results.

**Signature**

```ts
export declare const sequenceArray_: <E, A>(xs: readonly IOEither<E, A>[]) => IOEither<E, void>
```

```hs
sequenceArray_ :: Array (IOEither e a) -> IOEither e void
```

Added in v0.15.0

## traverseArray\_

Map to and sequence an array of fallible effects, ignoring the results.

**Signature**

```ts
export declare const traverseArray_: <E, A, B>(f: (x: A) => IOEither<E, B>) => (xs: readonly A[]) => IOEither<E, void>
```

```hs
traverseArray_ :: (a -> IOEither e b) -> Array a -> IOEither e void
```

Added in v0.15.0

# 3 Functions

## unsafeExpect

Unwrap the value from within an `IOEither`, throwing the inner value of
`Left` via `Show` if `Left`.

**Signature**

```ts
export declare const unsafeExpect: <E>(S: Show<E>) => <A>(x: IOEither<E, A>) => A
```

```hs
unsafeExpect :: Show e -> IOEither e a -> a
```

**Example**

```ts
import { unsafeExpect } from 'fp-ts-std/IOEither'
import * as IOE from 'fp-ts/IOEither'
import * as Str from 'fp-ts/string'

assert.throws(() => unsafeExpect(Str.Show)(IOE.left('foo')), /^"foo"$/)
```

Added in v0.16.0

## unsafeExpectLeft

Unwrap the value from within an `IOEither`, throwing the inner value of
`Right` via `Show` if `Right`.

**Signature**

```ts
export declare const unsafeExpectLeft: <A>(S: Show<A>) => <E>(x: IOEither<E, A>) => E
```

```hs
unsafeExpectLeft :: Show a -> IOEither e a -> e
```

**Example**

```ts
import { unsafeExpectLeft } from 'fp-ts-std/IOEither'
import * as IOE from 'fp-ts/IOEither'
import * as Str from 'fp-ts/string'

assert.throws(() => unsafeExpectLeft(Str.Show)(IOE.right('foo')), /^"foo"$/)
```

Added in v0.16.0

## unsafeUnwrap

Unwrap the value from within an `IOEither`, throwing with the inner value of
`Left` if `Left`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: IOEither<unknown, A>) => A
```

```hs
unsafeUnwrap :: IOEither unknown a -> a
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/IOEither'
import * as IOE from 'fp-ts/IOEither'

assert.strictEqual(unsafeUnwrap(IOE.right(5)), 5)
```

Added in v0.15.0

## unsafeUnwrapLeft

Unwrap the value from within an `IOEither`, throwing the inner value of
`Right` if `Right`.

**Signature**

```ts
export declare const unsafeUnwrapLeft: <E>(x: IOEither<E, unknown>) => E
```

```hs
unsafeUnwrapLeft :: IOEither e unknown -> e
```

**Example**

```ts
import { unsafeUnwrapLeft } from 'fp-ts-std/IOEither'
import * as IOE from 'fp-ts/IOEither'

assert.strictEqual(unsafeUnwrapLeft(IOE.left(5)), 5)
```

Added in v0.15.0
