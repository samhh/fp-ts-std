---
title: JSON.ts
nav_order: 8
parent: Modules
---

## JSON overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [JSONString (type alias)](#jsonstring-type-alias)
  - [parse](#parse)
  - [parseO](#parseo)
  - [stringify](#stringify)
  - [stringifyO](#stringifyo)
  - [stringifyPrimitive](#stringifyprimitive)
  - [unstringify](#unstringify)

---

# utils

## JSONString (type alias)

Newtype representing stringified JSON.

**Signature**

```ts
export type JSONString = Newtype<{ readonly JSONString: unique symbol }, string>
```

Added in v0.5.0

## parse

Parse a string as JSON.

**Signature**

```ts
export declare const parse: <E>(f: (e: SyntaxError) => E) => (x: string) => Either<E, unknown>
```

Added in v0.1.0

## parseO

Parse a string as JSON, returning an `Option`.

**Signature**

```ts
export declare const parseO: (stringified: string) => Option<unknown>
```

Added in v0.1.0

## stringify

Stringify some arbitrary data.

**Signature**

```ts
export declare const stringify: <E>(f: (e: TypeError) => E) => (x: unknown) => Either<E, JSONString>
```

Added in v0.1.0

## stringifyO

Stringify some arbitrary data, returning an `Option`.

**Signature**

```ts
export declare const stringifyO: (data: unknown) => Option<JSONString>
```

Added in v0.1.0

## stringifyPrimitive

Stringify a primitive value with no possibility of failure.

**Signature**

```ts
export declare const stringifyPrimitive: (x: string | number | boolean) => JSONString
```

Added in v0.1.0

## unstringify

Parse a string as JSON. This is safe provided there have been no shenanigans
with the `JSONString` newtype.

**Signature**

```ts
export declare const unstringify: (x: JSONString) => unknown
```

Added in v0.5.0
