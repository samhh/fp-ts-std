---
title: Enum.ts
nav_order: 10
parent: Modules
---

## Enum overview

Not to be confused with TypeScript's enums, this module refers to
enumeration, modelled similarly to PureScript's `BoundedEnum`.

Most functions in this module are extremely expensive if called on instances
of very large types.

Added in v0.17.0

---

<h2 class="text-delta">Table of contents</h2>

- [0 Types](#0-types)
  - [Enum (type alias)](#enum-type-alias)
- [1 Typeclass Instances](#1-typeclass-instances)
  - [getUnsafeConstantEnum](#getunsafeconstantenum)
- [2 Typeclass Methods](#2-typeclass-methods)
  - [downFromExcl](#downfromexcl)
  - [downFromIncl](#downfromincl)
  - [fromThenTo](#fromthento)
  - [fromTo](#fromto)
  - [inverseMap](#inversemap)
  - [universe](#universe)
  - [upFromExcl](#upfromexcl)
  - [upFromIncl](#upfromincl)
- [3 Functions](#3-functions)
  - [defaultCardinality](#defaultcardinality)

---

# 0 Types

## Enum (type alias)

Typeclass for finite enumerations.

The retraction laws state that when operations succeed, `succ` and `pred`
reverse one-another:
pred >=> succ >=> pred = pred
succ >=> pred >=> succ = succ

The non-skipping laws state that calls to `succ` and `pred` should not skip
any members of the given type. For example, an instance for a sum type of
ordered members `A`, `B`, and `C` should traverse the members like so:
`A <-> B <-> C`, skipping no member and following the order defined by the
`Ord` instance.

`fromEnum` should always return an integer. `toEnum` should not accept
non-integer inputs. They should both be zero-based.

**Signature**

```ts
export type Enum<A> = Bounded<A> & {
  succ: (x: A) => Option<A>
  pred: (x: A) => Option<A>
  toEnum: (index: number) => Option<A>
  fromEnum: (x: A) => number
  cardinality: Lazy<number>
}
```

```hs
type Enum a = Bounded a & { succ: a -> Option a, pred: a -> Option a, toEnum: number -> Option a, fromEnum: a -> number, cardinality: Lazy number }
```

Added in v0.17.0

# 1 Typeclass Instances

## getUnsafeConstantEnum

Produces an Enum instance that's potentially both unlawful and unsafe from a
list of values. Convenient for partially enumerating wide or deep types that
contain a few very large types such as strings.

The instance will be unsafe if `xs` does not contain every member of `A`. If
this is the case, the only function that can throw is `fromEnum`.

Behaviour in case of duplicate values is unspecified.

**Signature**

```ts
export declare const getUnsafeConstantEnum: <A>(Ord: Ord<A>) => (xs: NEA.NonEmptyArray<A>) => Enum<A>
```

**Example**

```ts
import { Enum, getUnsafeConstantEnum } from 'fp-ts-std/Enum'
import * as Bool from 'fp-ts/boolean'
import { Enum as EnumBool1 } from 'fp-ts-std/Boolean'

// A safe instance equivalent to the real instance albeit with worse
// performance characteristics.
const EnumBool2: Enum<boolean> = getUnsafeConstantEnum(Bool.Ord)([false, true])

assert.strictEqual(EnumBool2.fromEnum(true), 1)

assert.strictEqual(EnumBool1.fromEnum(true), EnumBool2.fromEnum(true))
assert.strictEqual(EnumBool1.fromEnum(false), EnumBool2.fromEnum(false))
```

Added in v0.17.0

# 2 Typeclass Methods

## downFromExcl

Produces all predecessors of `start` exclusive.

**Signature**

```ts
export declare const downFromExcl: <A>(E: Enum<A>) => (end: A) => A[]
```

```hs
downFromExcl :: Enum a -> a -> Array a
```

**Example**

```ts
import { downFromExcl } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'

const f = downFromExcl(EnumBool)

assert.deepStrictEqual(f(true), [false])
assert.deepStrictEqual(f(false), [])
```

Added in v0.17.0

## downFromIncl

Produces all predecessors of `start` inclusive.

**Signature**

```ts
export declare const downFromIncl: <A>(E: Enum<A>) => (start: A) => NEA.NonEmptyArray<A>
```

**Example**

```ts
import { downFromIncl } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'

const f = downFromIncl(EnumBool)

assert.deepStrictEqual(f(true), [true, false])
assert.deepStrictEqual(f(false), [false])
```

Added in v0.17.0

## fromThenTo

Returns a sequence of elements from `first` until `limit` with step size
determined by the difference between `first` and `second`. Behaviour is
unspecified if `end` is not greater than `start` or `step` is non-positive.

**Signature**

```ts
export declare const fromThenTo: <A>(E: Enum<A>) => (first: A) => (second: A) => (limit: A) => NEA.NonEmptyArray<A>
```

**Example**

```ts
import { fromThenTo } from 'fp-ts-std/Enum'
import { EnumInt } from 'fp-ts-std/Number'

const f = fromThenTo(EnumInt)

assert.deepStrictEqual(f(0)(2)(6), [0, 2, 4, 6])
assert.deepStrictEqual(f(0)(3)(5), [0, 3])
```

Added in v0.17.0

## fromTo

Returns a contiguous sequence of elements between `start` and `end`
inclusive. Behaviour is unspecified if `end` is not greater than `start`.

**Signature**

```ts
export declare const fromTo: <A>(E: Enum<A>) => (start: A) => (limit: A) => NEA.NonEmptyArray<A>
```

**Example**

```ts
import { fromTo } from 'fp-ts-std/Enum'
import { EnumInt } from 'fp-ts-std/Number'

const range = fromTo(EnumInt)

assert.deepStrictEqual(range(0)(3), [0, 1, 2, 3])
```

Added in v0.17.0

## inverseMap

Creates a fallible function that's the inverse of `f`. `f` is expected to
return distinct `B` values for any given `A`; behaviour when this is not the
case is unspecified.

Inverse mapping can be thought of as akin to a partial isomorphism. If the
types are totally isomorphic, consider instead defining an isomorphism to do
away with the infallibility.

**Signature**

```ts
export declare const inverseMap: <A>(E: Enum<A>) => <B>(Eq: Eq<B>) => (f: (x: A) => B) => (x: B) => O.Option<A>
```

**Example**

```ts
import { inverseMap } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'
import { Show as ShowBool } from 'fp-ts/boolean'
import * as Str from 'fp-ts/string'
import * as O from 'fp-ts/Option'

const parseBool = inverseMap(EnumBool)(Str.Eq)(ShowBool.show)

assert.deepStrictEqual(parseBool('true'), O.some(true))
assert.deepStrictEqual(parseBool('false'), O.some(false))
assert.deepStrictEqual(parseBool('foobar'), O.none)
```

Added in v0.17.0

## universe

Enumerates every value of an `Enum` in ascending order.

**Signature**

```ts
export declare const universe: <A>(E: Enum<A>) => NEA.NonEmptyArray<A>
```

**Example**

```ts
import { universe } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'

assert.deepStrictEqual(universe(EnumBool), [false, true])
```

Added in v0.17.0

## upFromExcl

Produces all successors of `start` exclusive.

**Signature**

```ts
export declare const upFromExcl: <A>(E: Enum<A>) => (start: A) => A[]
```

```hs
upFromExcl :: Enum a -> a -> Array a
```

**Example**

```ts
import { upFromExcl } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'

const f = upFromExcl(EnumBool)

assert.deepStrictEqual(f(false), [true])
assert.deepStrictEqual(f(true), [])
```

Added in v0.17.0

## upFromIncl

Produces all successors of `start` inclusive.

**Signature**

```ts
export declare const upFromIncl: <A>(E: Enum<A>) => (start: A) => NEA.NonEmptyArray<A>
```

**Example**

```ts
import { upFromIncl } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'

const f = upFromIncl(EnumBool)

assert.deepStrictEqual(f(false), [false, true])
assert.deepStrictEqual(f(true), [true])
```

Added in v0.17.0

# 3 Functions

## defaultCardinality

Provides a default, inefficient implementation of `cardinality`.

**Signature**

```ts
export declare const defaultCardinality: <A>(
  E: Pick<Enum<A>, 'top' | 'bottom' | 'compare' | 'equals' | 'succ' | 'pred' | 'toEnum' | 'fromEnum'>
) => number
```

```hs
defaultCardinality :: Pick (Enum a) ("top" | ("bottom" | ("compare" | ("equals" | ("succ" | ("pred" | ("toEnum" | "fromEnum"))))))) -> number
```

**Example**

```ts
import { defaultCardinality } from 'fp-ts-std/Enum'
import { Enum as EnumBool } from 'fp-ts-std/Boolean'

assert.strictEqual(defaultCardinality(EnumBool), 2)
```

Added in v0.17.0
