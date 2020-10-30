---
title: URLSearchParams.ts
nav_order: 15
parent: Modules
---

## URLSearchParams overview

Added in v0.2.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [clone](#clone)
  - [empty](#empty)
  - [fromRecord](#fromrecord)
  - [fromString](#fromstring)
  - [fromTuples](#fromtuples)
  - [getParam](#getparam)
  - [isURLSearchParams](#isurlsearchparams)
  - [setParam](#setparam)

---

# utils

## clone

Clone a `URLSearchParams`.

**Signature**

```ts
export declare const clone: (x: URLSearchParams) => URLSearchParams
```

Added in v0.2.0

## empty

An empty `URLSearchParams`.

**Signature**

```ts
export declare const empty: URLSearchParams
```

Added in v0.2.0

## fromRecord

Parse a `URLSearchParams` from a record.

**Signature**

```ts
export declare const fromRecord: (x: Record<string, string>) => URLSearchParams
```

Added in v0.2.0

## fromString

Parse a `URLSearchParams` from a string.

**Signature**

```ts
export declare const fromString: (x: string) => URLSearchParams
```

Added in v0.2.0

## fromTuples

Parse a `URLSearchParams` from an array of tuples.

**Signature**

```ts
export declare const fromTuples: (x: [string, string][]) => URLSearchParams
```

Added in v0.2.0

## getParam

Attempt to get a URL parameter from a `URLSearchParams`.

**Signature**

```ts
export declare const getParam: (k: string) => (ps: URLSearchParams) => Option<string>
```

Added in v0.1.0

## isURLSearchParams

Refine a foreign value to `URLSearchParams`.

**Signature**

```ts
export declare const isURLSearchParams: Refinement<unknown, URLSearchParams>
```

Added in v0.1.0

## setParam

Set a URL parameter in a `URLSearchParams`. This does not mutate the input.

**Signature**

```ts
export declare const setParam: (k: string) => (v: string) => (x: URLSearchParams) => URLSearchParams
```

Added in v0.1.0
