---
title: Show.ts
nav_order: 30
parent: Modules
---

## Show overview

Utilities to accommodate `fp-ts/Show`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Contravariant](#contravariant)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [contramap](#contramap)

---

# utils

## Contravariant

Formal `Contravariant` instance for `Show` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const Contravariant: Contravariant1<'Show'>
```

```hs
Contravariant :: Contravariant1 "Show"
```

Added in v0.12.0

## URI

Typeclass machinery.

**Signature**

```ts
export declare const URI: 'Show'
```

```hs
URI :: "Show"
```

Added in v0.12.0

## URI (type alias)

Typeclass machinery.

**Signature**

```ts
export type URI = typeof URI
```

```hs
type URI = typeof URI
```

Added in v0.12.0

## contramap

Derive an instance for `Show<B>` by providing a function from `B` to `A` and
a `Show<A>` instance.

**Signature**

```ts
export declare const contramap: <B, A>(f: (b: B) => A) => (m: Show<A>) => Show<B>
```

```hs
contramap :: (b -> a) -> Show a -> Show b
```

Added in v0.12.0
