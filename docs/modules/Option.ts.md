---
title: Option.ts
nav_order: 17
parent: Modules
---

## Option overview

Utility functions to accommodate `fp-ts/Option`.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [invert](#invert)
  - [memptyUnless](#memptyunless)
  - [memptyWhen](#memptywhen)
  - [noneAs](#noneas)
  - [toMonoid](#tomonoid)
  - [unsafeUnwrap](#unsafeunwrap)

---

# utils

## invert

Given an unwrapped value and an associated `Eq` instance for determining
equivalence, inverts an `Option` that may contain the same value, something
else, or nothing.

This can be useful for circumstances in which you want to in a sense toggle
an `Option` value.

**Signature**

```ts
export declare const invert: <A>(eq: Eq<A>) => (val: A) => Endomorphism<Option<A>>
```

```hs
invert :: Eq a -> a -> Endomorphism (Option a)
```

**Example**

```ts
import { invert } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'

const f = invert(S.Eq)('x')

assert.deepStrictEqual(f(O.none), O.some('x'))
assert.deepStrictEqual(f(O.some('y')), O.some('x'))
assert.deepStrictEqual(f(O.some('x')), O.none)
```

Added in v0.12.0

## memptyUnless

Conditionally returns the provided `Option` or `None`. The dual to
`memptyWhen`.

**Signature**

```ts
export declare const memptyUnless: (x: boolean) => <A>(m: Option<A>) => Option<A>
```

```hs
memptyUnless :: boolean -> Option a -> Option a
```

**Example**

```ts
import { memptyUnless } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(memptyUnless(true)(O.some('x')), O.some('x'))
assert.deepStrictEqual(memptyUnless(true)(O.none), O.none)
assert.deepStrictEqual(memptyUnless(false)(O.some('x')), O.none)
assert.deepStrictEqual(memptyUnless(false)(O.none), O.none)
```

Added in v0.13.0

## memptyWhen

Conditionally returns the provided `Option` or `None`. The dual to
`memptyUnless`.

**Signature**

```ts
export declare const memptyWhen: (x: boolean) => <A>(m: Option<A>) => Option<A>
```

```hs
memptyWhen :: boolean -> Option a -> Option a
```

**Example**

```ts
import { memptyWhen } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(memptyWhen(true)(O.some('x')), O.none)
assert.deepStrictEqual(memptyWhen(true)(O.none), O.none)
assert.deepStrictEqual(memptyWhen(false)(O.some('x')), O.some('x'))
assert.deepStrictEqual(memptyWhen(false)(O.none), O.none)
```

Added in v0.13.0

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

## toMonoid

Extracts monoidal identity if `None`.

**Signature**

```ts
export declare const toMonoid: <A>(G: Monoid<A>) => (x: Option<A>) => A
```

```hs
toMonoid :: Monoid a -> Option a -> a
```

**Example**

```ts
import { toMonoid } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'
import * as Str from 'fp-ts/string'

const f = toMonoid(Str.Monoid)

assert.deepStrictEqual(f(O.some('x')), 'x')
assert.deepStrictEqual(f(O.none), '')
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
