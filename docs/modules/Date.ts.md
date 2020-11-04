---
title: Date.ts
nav_order: 3
parent: Modules
---

## Date overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [getTime](#gettime)
  - [isDate](#isdate)
  - [isValid](#isvalid)
  - [parseDate](#parsedate)
  - [toISOString](#toisostring)
  - [unsafeParseDate](#unsafeparsedate)

---

# utils

## getTime

Get the time in milliseconds from a `Date`.

**Signature**

```ts
export declare const getTime: (x: Date) => number
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

**Example**

```ts
import { isValid } from 'fp-ts-std/Date'

const valid = new Date()
const invalid = new Date('this will not parse')

assert.strictEqual(isValid(valid), true)
assert.strictEqual(isValid(invalid), false)
```

Added in v0.1.0

## parseDate

Safely parse a date.

**Signature**

```ts
export declare const parseDate: (ts: string | number) => Option<Date>
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

**Example**

```ts
import { toISOString } from 'fp-ts-std/Date'

const d = new Date()

assert.strictEqual(toISOString(d), d.toISOString())
```

Added in v0.1.0

## unsafeParseDate

Parse a date, leaving open the risk of a failure to parse resulting in an
invalid `Date` being returned.

**Signature**

```ts
export declare const unsafeParseDate: (x: string | number) => Date
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
