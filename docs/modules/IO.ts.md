---
title: IO.ts
nav_order: 13
parent: Modules
---

## IO overview

Utility functions to accommodate `fp-ts/IO`.

Added in v0.7.0

---

<h2 class="text-delta">Table of contents</h2>

- [2 Typeclass Methods](#2-typeclass-methods)
  - [sequenceArray\_](#sequencearray_)
  - [traverseArray\_](#traversearray_)
  - [unless](#unless)
  - [when](#when)
- [3 Functions](#3-functions)
  - [execute](#execute)
  - [memoize](#memoize)
  - [once](#once)
  - [whenInvocationCount](#wheninvocationcount)

---

# 2 Typeclass Methods

## sequenceArray\_

Sequence an array of effects, ignoring the results.

**Signature**

```ts
export declare const sequenceArray_: <A>(xs: readonly IO<A>[]) => IO<void>
```

```hs
sequenceArray_ :: Array (IO a) -> IO void
```

Added in v0.15.0

## traverseArray\_

Map to and sequence an array of effects, ignoring the results.

**Signature**

```ts
export declare const traverseArray_: <A, B>(f: (x: A) => IO<B>) => (xs: readonly A[]) => IO<void>
```

```hs
traverseArray_ :: (a -> IO b) -> Array a -> IO void
```

Added in v0.15.0

## unless

The reverse of `when`.

**Signature**

```ts
export declare const unless: (x: boolean) => Endomorphism<IO<void>>
```

```hs
unless :: boolean -> Endomorphism (IO void)
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/Predicate'
import { unless } from 'fp-ts-std/IO'
import * as IOE from 'fp-ts/IOEither'
import { log } from 'fp-ts/Console'

const isValid: Predicate<number> = (n) => n === 42

pipe(
  IOE.of(123),
  IOE.chainFirstIOK((n) => unless(isValid(n))(log(n)))
)
```

Added in v0.12.0

## when

Conditional execution of an `IO`. Helpful for things like logging.

**Signature**

```ts
export declare const when: (x: boolean) => Endomorphism<IO<void>>
```

```hs
when :: boolean -> Endomorphism (IO void)
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/Predicate'
import { when } from 'fp-ts-std/IO'
import * as IOE from 'fp-ts/IOEither'
import { log } from 'fp-ts/Console'

const isInvalid: Predicate<number> = (n) => n !== 42

pipe(
  IOE.of(123),
  IOE.chainFirstIOK((n) => when(isInvalid(n))(log(n)))
)
```

Added in v0.12.0

# 3 Functions

## execute

Execute an `IO`, returning the value within. Helpful for staying within
function application and composition pipelines.

**Signature**

```ts
export declare const execute: <A>(x: IO<A>) => A
```

```hs
execute :: IO a -> a
```

**Example**

```ts
import { execute } from 'fp-ts-std/IO'
import * as IO from 'fp-ts/IO'

assert.strictEqual(execute(IO.of(5)), 5)
```

Added in v0.12.0

## memoize

Memoize an `IO`, reusing the result of its first execution.

**Signature**

```ts
export declare const memoize: <A>(f: IO<A>) => IO<A>
```

```hs
memoize :: IO a -> IO a
```

**Example**

```ts
import { memoize } from 'fp-ts-std/IO'
import { now } from 'fp-ts-std/Date'

const then = memoize(now)

assert.strictEqual(then(), then())
```

Added in v0.14.0

## once

Given a function, returns a new function that always returns the output
value of its first invocation.

**Signature**

```ts
export declare const once: <A, B>(f: (x: A) => B) => (x: A) => IO<B>
```

```hs
once :: (a -> b) -> a -> IO b
```

**Example**

```ts
import { once } from 'fp-ts-std/IO'
import * as IO from 'fp-ts/IO'
import { add } from 'fp-ts-std/Number'

const f = once(add(5))

assert.strictEqual(f(2)(), 7)
assert.strictEqual(f(3)(), 7)
```

Added in v0.7.0

## whenInvocationCount

Applies an effectful function when the predicate against the invocation
count passes.

The invocation count will continue to increment and the predicate will
continue to be checked on future invocations even after the predicate fails.

Invocations start at the number one.

**Signature**

```ts
export declare const whenInvocationCount: (p: Predicate<number>) => Endomorphism<IO<void>>
```

```hs
whenInvocationCount :: Predicate number -> Endomorphism (IO void)
```

**Example**

```ts
import { IO } from 'fp-ts/IO'
import { Predicate } from 'fp-ts/Predicate'
import { whenInvocationCount } from 'fp-ts-std/IO'

const isUnderThree: Predicate<number> = (n) => n < 3

let n = 0
const increment: IO<void> = () => {
  n++
}

const f = whenInvocationCount(isUnderThree)(increment)

assert.strictEqual(n, 0)
f()
assert.strictEqual(n, 1)
f()
assert.strictEqual(n, 2)
f()
assert.strictEqual(n, 2)
```

Added in v0.12.0
