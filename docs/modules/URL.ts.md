---
title: URL.ts
nav_order: 13
parent: Modules
---

## URL overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [getParam](#getparam)
  - [isURL](#isurl)
  - [isURLSearchParams](#isurlsearchparams)
  - [parse](#parse)
  - [parseO](#parseo)
  - [setParam](#setparam)
  - [unsafeParse](#unsafeparse)

---

# utils

## getParam

Attempt to get a URL parameter from a `URLSearchParams`.

**Signature**

```ts
export declare const getParam: (k: string) => (ps: URLSearchParams) => Option<string>
```

Added in v0.1.0

## isURL

Refine a foreign value to `URL`.

**Signature**

```ts
export declare const isURL: Refinement<unknown, URL>
```

Added in v0.1.0

## isURLSearchParams

Refine a foreign value to `URLSearchParams`.

**Signature**

```ts
export declare const isURLSearchParams: Refinement<unknown, URLSearchParams>
```

Added in v0.1.0

## parse

Safely parse a `URL`.

**Signature**

```ts
export declare const parse: <E>(f: (e: TypeError) => E) => (x: string) => Either<E, URL>
```

Added in v0.1.0

## parseO

Safely parse a `URL`, returning an `Option`.

**Signature**

```ts
export declare const parseO: (x: string) => Option<URL>
```

Added in v0.1.0

## setParam

Set a URL parameter in a `URLSearchParams`. This does not mutate the input.

**Signature**

```ts
export declare const setParam: (k: string) => (v: string) => (x: URLSearchParams) => URLSearchParams
```

Added in v0.1.0

## unsafeParse

Unsafely parse a `URL`, throwing on failure.

**Signature**

```ts
export declare const unsafeParse: (x: string) => URL
```

Added in v0.1.0
