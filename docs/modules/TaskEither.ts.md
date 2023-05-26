---
title: TaskEither.ts
nav_order: 41
parent: Modules
---

## TaskEither overview

Utility functions to accommodate `fp-ts/TaskEither`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [2 Typeclass Methods](#2-typeclass-methods)
  - [sequenceArray\_](#sequencearray_)
  - [sequenceSeqArray\_](#sequenceseqarray_)
  - [traverseArray\_](#traversearray_)
  - [traverseSeqArray\_](#traverseseqarray_)
- [3 Functions](#3-functions)
  - [unsafeExpect](#unsafeexpect)
  - [unsafeExpectLeft](#unsafeexpectleft)
  - [unsafeUnwrap](#unsafeunwrap)
  - [unsafeUnwrapLeft](#unsafeunwrapleft)

---

# 2 Typeclass Methods

## sequenceArray\_

Sequence an array of fallible tasks, ignoring the results.

**Signature**

```ts
export declare const sequenceArray_: <E, A>(xs: readonly TaskEither<E, A>[]) => TaskEither<E, void>
```

```hs
sequenceArray_ :: Array (TaskEither e a) -> TaskEither e void
```

Added in v0.15.0

## sequenceSeqArray\_

Sequentially sequence an array of fallible tasks, ignoring the results.

**Signature**

```ts
export declare const sequenceSeqArray_: <E, A>(xs: readonly TaskEither<E, A>[]) => TaskEither<E, void>
```

```hs
sequenceSeqArray_ :: Array (TaskEither e a) -> TaskEither e void
```

Added in v0.15.0

## traverseArray\_

Map to and sequence an array of fallible tasks, ignoring the results.

**Signature**

```ts
export declare const traverseArray_: <E, A, B>(
  f: (x: A) => TaskEither<E, B>
) => (xs: readonly A[]) => TaskEither<E, void>
```

```hs
traverseArray_ :: (a -> TaskEither e b) -> Array a -> TaskEither e void
```

Added in v0.15.0

## traverseSeqArray\_

Sequentially map to and sequence an array of fallible tasks, ignoring the
results.

**Signature**

```ts
export declare const traverseSeqArray_: <E, A, B>(
  f: (x: A) => TaskEither<E, B>
) => (xs: readonly A[]) => TaskEither<E, void>
```

```hs
traverseSeqArray_ :: (a -> TaskEither e b) -> Array a -> TaskEither e void
```

Added in v0.15.0

# 3 Functions

## unsafeExpect

Unwrap the promise from within a `TaskEither`, rejecting with the inner
value of `Left` via `Show` if `Left`.

**Signature**

```ts
export declare const unsafeExpect: <E>(S: Show<E>) => <A>(x: TaskEither<E, A>) => Promise<A>
```

```hs
unsafeExpect :: Show e -> TaskEither e a -> Promise a
```

**Example**

```ts
import { unsafeExpect } from 'fp-ts-std/TaskEither'
import * as TE from 'fp-ts/TaskEither'
import * as Str from 'fp-ts/string'

assert.rejects(unsafeExpect(Str.Show)(TE.left('foo')), /^"foo"$/)
```

Added in v0.16.0

## unsafeExpectLeft

Unwrap the promise from within a `TaskEither`, rejecting with the inner
value of `Right` via `Show` if `Right`.

**Signature**

```ts
export declare const unsafeExpectLeft: <A>(S: Show<A>) => <E>(x: TaskEither<E, A>) => Promise<E>
```

```hs
unsafeExpectLeft :: Show a -> TaskEither e a -> Promise e
```

**Example**

```ts
import { unsafeExpectLeft } from 'fp-ts-std/TaskEither'
import * as TE from 'fp-ts/TaskEither'
import * as Str from 'fp-ts/string'

assert.rejects(unsafeExpectLeft(Str.Show)(TE.right('foo')), /^"foo"$/)
```

Added in v0.16.0

## unsafeUnwrap

Unwrap the promise from within a `TaskEither`, rejecting with the inner
value of `Left` if `Left`.

**Signature**

```ts
export declare const unsafeUnwrap: <A>(x: TaskEither<unknown, A>) => Promise<A>
```

```hs
unsafeUnwrap :: TaskEither unknown a -> Promise a
```

**Example**

```ts
import { unsafeUnwrap } from 'fp-ts-std/TaskEither'
import * as TE from 'fp-ts/TaskEither'

unsafeUnwrap(TE.right(5)).then((x) => {
  assert.strictEqual(x, 5)
})
```

Added in v0.12.0

## unsafeUnwrapLeft

Unwrap the promise from within a `TaskEither`, throwing the inner value of
`Right` if `Right`.

**Signature**

```ts
export declare const unsafeUnwrapLeft: <E>(x: TaskEither<E, unknown>) => Promise<E>
```

```hs
unsafeUnwrapLeft :: TaskEither e unknown -> Promise e
```

**Example**

```ts
import { unsafeUnwrapLeft } from 'fp-ts-std/TaskEither'
import * as TE from 'fp-ts/TaskEither'

unsafeUnwrapLeft(TE.left(5)).then((x) => {
  assert.strictEqual(x, 5)
})
```

Added in v0.12.0
