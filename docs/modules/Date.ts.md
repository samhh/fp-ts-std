---
title: Date.ts
nav_order: 3
parent: Modules
---

## Date overview

Various functions to aid in working with JavaScript's `Date` object.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Milliseconds (type alias)](#milliseconds-type-alias)
  - [fieldMilliseconds](#fieldmilliseconds)
  - [fromMilliseconds](#frommilliseconds)
  - [getTime](#gettime)
  - [isDate](#isdate)
  - [isValid](#isvalid)
  - [isoMilliseconds](#isomilliseconds)
  - [mkMilliseconds](#mkmilliseconds)
  - [now](#now)
  - [ordMilliseconds](#ordmilliseconds)
  - [parseDate](#parsedate)
  - [toISOString](#toisostring)
  - [unMilliseconds](#unmilliseconds)
  - [unsafeParseDate](#unsafeparsedate)

---

# utils

## Milliseconds (type alias)

Newtype representing milliseconds.

**Signature**

```ts
export type Milliseconds = Newtype<{ readonly Milliseconds: unique symbol }, number>
```

```hs
newtype Milliseconds = number
```

Added in v0.7.0

## fieldMilliseconds

`Field` instance for `Milliseconds`, enabling arithmetic over the type.

**Signature**

```ts
export declare const fieldMilliseconds: Field<Milliseconds>
```

```hs
fieldMilliseconds :: Field Milliseconds
```

Added in v0.7.0

## fromMilliseconds

Get a `Date` from `Milliseconds`.

**Signature**

```ts
export declare const fromMilliseconds: (x: Milliseconds) => Date
```

```hs
fromMilliseconds :: Milliseconds -> Date
```

Added in v0.7.0

## getTime

Get the time in milliseconds from a `Date`.

**Signature**

```ts
export declare const getTime: (x: Date) => Milliseconds
```

```hs
getTime :: Date -> Milliseconds
```

**Example**

```ts
import { getTime } from 'fp-ts-std/Date'

const d = new Date()

assert.strictEqual(getTime(d), d.getTime())
```

Added in v0.1.0

## isDate

Check if a foreign value is a `Date`.

**Signature**

```ts
export declare const isDate: Refinement<unknown, Date>
```

```hs
isDate :: Refinement unknown Date
```

**Example**

```ts
import { isDate } from 'fp-ts-std/Date'

assert.strictEqual(isDate(new Date()), true)
assert.strictEqual(isDate({ not: { a: 'date' } }), false)
```

Added in v0.1.0

## isValid

Check if a `Date` is actually valid. (We all love JavaScript, don't we?)

**Signature**

```ts
export declare const isValid: Predicate<Date>
```

```hs
isValid :: Predicate Date
```

**Example**

```ts
import { isValid } from 'fp-ts-std/Date'

const valid = new Date()
const invalid = new Date('this will not parse')

assert.strictEqual(isValid(valid), true)
assert.strictEqual(isValid(invalid), false)
```

Added in v0.1.0

## isoMilliseconds

`Iso` instance for `Milliseconds`, enabling the use of lenses over the
newtype pertaining to its isomorphic nature.

**Signature**

```ts
export declare const isoMilliseconds: Iso<Milliseconds, number>
```

```hs
isoMilliseconds :: Iso Milliseconds number
```

Added in v0.7.0

## mkMilliseconds

Lift a number to the `Milliseconds` newtype.

**Signature**

```ts
export declare const mkMilliseconds: (a: number) => Milliseconds
```

```hs
mkMilliseconds :: number -> Milliseconds
```

Added in v0.7.0

## now

Get the time since the Unix Epoch in `Milliseconds` from a `Date`.

**Signature**

```ts
export declare const now: IO<Milliseconds>
```

```hs
now :: IO Milliseconds
```

Added in v0.7.0

## ordMilliseconds

`Ord` instance for `Milliseconds`, enabling comparison between different
instances of the type.

**Signature**

```ts
export declare const ordMilliseconds: Ord<Milliseconds>
```

```hs
ordMilliseconds :: Ord Milliseconds
```

Added in v0.7.0

## parseDate

Safely parse a date.

**Signature**

```ts
export declare const parseDate: (ts: string | number) => Option<Date>
```

```hs
parseDate :: string | number -> Option Date
```

**Example**

```ts
import { parseDate } from 'fp-ts-std/Date'
import * as O from 'fp-ts/Option'

const valid = 0
const invalid = 'this will not parse'

assert.deepStrictEqual(parseDate(valid), O.some(new Date(valid)))
assert.deepStrictEqual(parseDate(invalid), O.none)
```

Added in v0.1.0

## toISOString

Returns a date as a string value in ISO format.

**Signature**

```ts
export declare const toISOString: (x: Date) => string
```

```hs
toISOString :: Date -> string
```

**Example**

```ts
import { toISOString } from 'fp-ts-std/Date'

const d = new Date()

assert.strictEqual(toISOString(d), d.toISOString())
```

Added in v0.1.0

## unMilliseconds

Unwrap a `Milliseconds` newtype back to its underlying number representation.

**Signature**

```ts
export declare const unMilliseconds: (s: Milliseconds) => number
```

```hs
unMilliseconds :: Milliseconds -> number
```

Added in v0.7.0

## unsafeParseDate

Parse a date, leaving open the risk of a failure to parse resulting in an
invalid `Date` being returned.

**Signature**

```ts
export declare const unsafeParseDate: (x: string | number) => Date
```

```hs
unsafeParseDate :: string | number -> Date
```

**Example**

```ts
import { unsafeParseDate } from 'fp-ts-std/Date'

const valid = 0
const invalid = 'this will not parse'

assert.strictEqual(unsafeParseDate(valid).getTime(), 0)
assert.strictEqual(unsafeParseDate(invalid).getTime(), NaN)
```

Added in v0.1.0
