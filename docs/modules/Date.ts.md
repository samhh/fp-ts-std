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

Added in v0.1.0

## isDate

Check if a foreign value is a `Date`.

**Signature**

```ts
export declare const isDate: Refinement<unknown, Date>
```

Added in v0.1.0

## isValid

Check if a `Date` is actually valid. (We all love JavaScript, don't we?)

**Signature**

```ts
export declare const isValid: Predicate<Date>
```

Added in v0.1.0

## parseDate

Safely parse a date.

**Signature**

```ts
export declare const parseDate: (x: string | number) => O.Option<Date>
```

Added in v0.1.0

## toISOString

Returns a date as a string value in ISO format.

**Signature**

```ts
export declare const toISOString: (x: Date) => string
```

Added in v0.1.0

## unsafeParseDate

Parse a date, leaving open the risk of a failure to parse resulting in an
invalid `Date` being returned.

**Signature**

```ts
export declare const unsafeParseDate: (x: string | number) => Date
```

Added in v0.1.0
