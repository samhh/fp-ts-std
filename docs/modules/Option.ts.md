---
title: Option.ts
nav_order: 24
parent: Modules
---

## Option overview

Utility functions to accommodate `fp-ts/Option`.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [altAllBy](#altallby)
  - [getBounded](#getbounded)
  - [getEnum](#getenum)
  - [invert](#invert)
  - [match2](#match2)
  - [memptyUnless](#memptyunless)
  - [memptyWhen](#memptywhen)
  - [noneAs](#noneas)
  - [pureIf](#pureif)
  - [toMonoid](#tomonoid)
  - [unsafeExpect](#unsafeexpect)
  - [unsafeUnwrap](#unsafeunwrap)

---

# utils

## altAllBy

Like `altAll`, but flaps an input across an array of functions to produce
the `Option` values, short-circuiting upon a non-empty value. Useful given
`Option`'s eagerness.

**Signature**

```ts
export declare const altAllBy: <A, B>(fs: ((x: A) => Option<B>)[]) => (x: A) => Option<B>
```

```hs
altAllBy :: Array ((a -> Option b)) -> a -> Option b
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { altAllBy } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(altAllBy([constant(O.none), O.some])('foo'), O.some('foo'))
```

Added in v0.15.0

## getBounded

Derive a `Bounded` instance for `Option<A>` in which the top and bottom
bounds are `Some(B.top)` and `None` respectively.

**Signature**

```ts
export declare const getBounded: <A>(B: Bounded<A>) => Bounded<Option<A>>
```

```hs
getBounded :: Bounded a -> Bounded (Option a)
```

Added in v0.17.0

## getEnum

Derive an `Enum` instance for `Option<A>` given an `Enum` instance for `A`.

**Signature**

```ts
export declare const getEnum: <A>(E: Enum<A>) => Enum<Option<A>>
```

```hs
getEnum :: Enum a -> Enum (Option a)
```

**Example**

```ts
import { universe } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'
import * as O from 'fp-ts/Option'
import { getEnum as getEnumO } from 'fp-ts-std/Option'

const EnumBoolO = getEnumO(EnumBool)

assert.deepStrictEqual(universe(EnumBoolO), [O.none, O.some(false), O.some(true)])
```

Added in v0.17.0

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

## match2

Pattern match against two `Option`s simultaneously.

**Signature**

```ts
export declare const match2: <A, B, C>(
  onNone: L.Lazy<C>,
  onSomeFst: (x: A) => C,
  onSomeSnd: (x: B) => C,
  onSomeBoth: (x: A) => (y: B) => C
) => (mx: Option<A>) => (my: Option<B>) => C
```

**Example**

```ts
import { constant, flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import Option = O.Option
import { match2 } from 'fp-ts-std/Option'
import * as Str from 'fp-ts-std/String'

const f: (x: Option<string>) => (y: Option<number>) => string = match2(
  constant('Who are you?'),
  Str.prepend('Your name is '),
  flow(Str.fromNumber, Str.prepend('Your age is ')),
  (name) => (age) => `You are ${name}, ${age}`
)

assert.strictEqual(f(O.none)(O.some(40)), 'Your age is 40')
assert.strictEqual(f(O.some('Hodor'))(O.some(40)), 'You are Hodor, 40')
```

Added in v0.17.0

## memptyUnless

Conditionally returns the provided `Option` or `None`. The dual to
`memptyWhen`. The lazy value is evaluated only if the condition passes.

**Signature**

```ts
export declare const memptyUnless: (x: boolean) => <A>(m: L.Lazy<Option<A>>) => Option<A>
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { memptyUnless } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(memptyUnless(true)(constant(O.some('x'))), O.some('x'))
assert.deepStrictEqual(memptyUnless(true)(constant(O.none)), O.none)
assert.deepStrictEqual(memptyUnless(false)(constant(O.some('x'))), O.none)
assert.deepStrictEqual(memptyUnless(false)(constant(O.none)), O.none)
```

Added in v0.13.0

## memptyWhen

Conditionally returns the provided `Option` or `None`. The dual to
`memptyUnless`. The lazy value is evaluated only if the condition passes.

**Signature**

```ts
export declare const memptyWhen: (x: boolean) => <A>(m: L.Lazy<Option<A>>) => Option<A>
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { memptyWhen } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(memptyWhen(true)(constant(O.some('x'))), O.none)
assert.deepStrictEqual(memptyWhen(true)(constant(O.none)), O.none)
assert.deepStrictEqual(memptyWhen(false)(constant(O.some('x'))), O.some('x'))
assert.deepStrictEqual(memptyWhen(false)(constant(O.none)), O.none)
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

## pureIf

Conditionally lifts a value to `Some` or returns `None`. The lazy value is
evaluated only if the condition passes.

**Signature**

```ts
export declare const pureIf: (x: boolean) => <A>(y: L.Lazy<A>) => Option<A>
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { pureIf } from 'fp-ts-std/Option'
import { Predicate } from 'fp-ts/Predicate'

const person = { name: 'Hodor', age: 40 }
const isMagicNumber: Predicate<number> = (n) => n === 42

const mname = pureIf(isMagicNumber(person.age))(constant(person.name))
```

Added in v0.13.0

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

## unsafeExpect

Unwrap the value from within an `Option`, throwing `msg` if `None`.

**Signature**

```ts
export declare const unsafeExpect: (msg: string) => <A>(x: Option<A>) => A
```

```hs
unsafeExpect :: string -> Option a -> a
```

**Example**

```ts
import { unsafeExpect } from 'fp-ts-std/Option'
import * as O from 'fp-ts/Option'

assert.throws(() => unsafeExpect('foo')(O.none), /^foo$/)
```

Added in v0.16.0

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
