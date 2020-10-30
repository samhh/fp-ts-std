---
title: URL.ts
nav_order: 14
parent: Modules
---

## URL overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [isURL](#isurl)
  - [parse](#parse)
  - [parseO](#parseo)
  - [unsafeParse](#unsafeparse)

---

# utils

## isURL

Refine a foreign value to `URL`.

**Signature**

```ts
export declare const isURL: Refinement<unknown, URL>
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
export declare const parseO: (href: string) => Option<URL>
```

Added in v0.1.0

## unsafeParse

Unsafely parse a `URL`, throwing on failure.

**Signature**

```ts
export declare const unsafeParse: (x: string) => URL
```

Added in v0.1.0
