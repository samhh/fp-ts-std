---
title: JSON.ts
nav_order: 7
parent: Modules
---

## JSON overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [parse](#parse)
  - [parseO](#parseo)
  - [stringify](#stringify)
  - [stringifyO](#stringifyo)
  - [stringifyPrimitive](#stringifyprimitive)

---

# utils

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
export declare const stringify: <E>(f: (e: TypeError) => E) => (x: unknown) => Either<E, string>
```

Added in v0.1.0

## stringifyO

Stringify some arbitrary data, returning an `Option`.

**Signature**

```ts
export declare const stringifyO: (data: unknown) => Option<string>
```

Added in v0.1.0

## stringifyPrimitive

Stringify a primitive value with no possibility of failure.

**Signature**

```ts
export declare const stringifyPrimitive: (x: string | number | boolean) => string
```

Added in v0.1.0
