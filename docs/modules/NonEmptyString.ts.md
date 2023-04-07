---
title: NonEmptyString.ts
nav_order: 22
parent: Modules
---

## NonEmptyString overview

A newtype around strings signifying non-emptiness therein.

Many further utilities can be defined in terms of the `String` module via
contramap, for example any predicates.

Added in v0.15.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Eq](#eq)
  - [NonEmptyString (type alias)](#nonemptystring-type-alias)
  - [Ord](#ord)
  - [Semigroup](#semigroup)
  - [Show](#show)
  - [append](#append)
  - [fromNumber](#fromnumber)
  - [fromString](#fromstring)
  - [head](#head)
  - [last](#last)
  - [prepend](#prepend)
  - [reverse](#reverse)
  - [surround](#surround)
  - [toLowerCase](#tolowercase)
  - [toString](#tostring)
  - [toUpperCase](#touppercase)
  - [unNonEmptyString](#unnonemptystring)
  - [unsafeFromString](#unsafefromstring)

---

# utils

## Eq

`Eq` instance for `NonEmptyString` for testing equivalence.

**Signature**

```ts
export declare const Eq: Eq<NonEmptyString>
```

```hs
Eq :: Eq NonEmptyString
```

Added in v0.15.0

## NonEmptyString (type alias)

Newtype representing a non-empty string. Non-emptiness is only guaranteed so
long as interaction with the newtype is confined to exports from this module,
as unlike `NonEmptyArray` it's only protected by a smart constructor.

**Signature**

```ts
export type NonEmptyString = Newtype<NonEmptyStringSymbol, string>
```

```hs
type NonEmptyString = Newtype NonEmptyStringSymbol string
```

Added in v0.15.0

## Ord

`Ord` instance for `NonEmptyString` for comparison.

**Signature**

```ts
export declare const Ord: Ord<NonEmptyString>
```

```hs
Ord :: Ord NonEmptyString
```

Added in v0.15.0

## Semigroup

`Semigroup` instance for `NonEmptyString`, enabling concatenation.

**Signature**

```ts
export declare const Semigroup: Semigroup<NonEmptyString>
```

```hs
Semigroup :: Semigroup NonEmptyString
```

Added in v0.15.0

## Show

`Show` instance for `NonEmptyString`.

**Signature**

```ts
export declare const Show: Show<NonEmptyString>
```

```hs
Show :: Show NonEmptyString
```

Added in v0.15.0

## append

Append a string to a `NonEmptyString`.

**Signature**

```ts
export declare const append: (x: string) => Endomorphism<NonEmptyString>
```

```hs
append :: string -> Endomorphism NonEmptyString
```

Added in v0.15.0

## fromNumber

Safely derive a `NonEmptyString` from any number.

**Signature**

```ts
export declare const fromNumber: (x: number) => NonEmptyString
```

```hs
fromNumber :: number -> NonEmptyString
```

Added in v0.15.0

## fromString

Smart constructor from strings.

**Signature**

```ts
export declare const fromString: (x: string) => O.Option<NonEmptyString>
```

Added in v0.15.0

## head

Get the first character in a `NonEmptyString`.

**Signature**

```ts
export declare const head: Endomorphism<NonEmptyString>
```

```hs
head :: Endomorphism NonEmptyString
```

Added in v0.15.0

## last

Get the last character in a `NonEmptyString`.

**Signature**

```ts
export declare const last: Endomorphism<NonEmptyString>
```

```hs
last :: Endomorphism NonEmptyString
```

Added in v0.15.0

## prepend

Prepend a string to a `NonEmptyString`.

**Signature**

```ts
export declare const prepend: (x: string) => Endomorphism<NonEmptyString>
```

```hs
prepend :: string -> Endomorphism NonEmptyString
```

Added in v0.15.0

## reverse

Reverse a `NonEmptyString`.

**Signature**

```ts
export declare const reverse: Endomorphism<NonEmptyString>
```

```hs
reverse :: Endomorphism NonEmptyString
```

Added in v0.15.0

## surround

Surround a `NonEmptyString`. Equivalent to calling `prepend` and `append`
with the same outer value.

**Signature**

```ts
export declare const surround: (x: string) => Endomorphism<NonEmptyString>
```

```hs
surround :: string -> Endomorphism NonEmptyString
```

Added in v0.15.0

## toLowerCase

Convert a `NonEmptyString` to lowercase.

**Signature**

```ts
export declare const toLowerCase: Endomorphism<NonEmptyString>
```

```hs
toLowerCase :: Endomorphism NonEmptyString
```

Added in v0.15.0

## toString

An alias of `unNonEmptyString`.

**Signature**

```ts
export declare const toString: (x: NonEmptyString) => string
```

```hs
toString :: NonEmptyString -> string
```

Added in v0.15.0

## toUpperCase

Convert a `NonEmptyString` to uppercase.

**Signature**

```ts
export declare const toUpperCase: Endomorphism<NonEmptyString>
```

```hs
toUpperCase :: Endomorphism NonEmptyString
```

Added in v0.15.0

## unNonEmptyString

Unwrap a `NonEmptyString` newtype back to its underlying string
representation.

**Signature**

```ts
export declare const unNonEmptyString: (x: NonEmptyString) => string
```

```hs
unNonEmptyString :: NonEmptyString -> string
```

Added in v0.15.0

## unsafeFromString

Unsafely lift a string to `NonEmptyString`. Can be useful for static values.
Try to use `fromString` instead.

**Signature**

```ts
export declare const unsafeFromString: (x: string) => NonEmptyString
```

```hs
unsafeFromString :: string -> NonEmptyString
```

Added in v0.15.0
