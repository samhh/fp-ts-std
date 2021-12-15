---
title: Isomorphism.ts
nav_order: 13
parent: Modules
---

## Isomorphism overview

This module and its namesake type formalise the notion of isomorphism.

Two types which are isomorphic can be considered for all intents and
purposes to be equivalent. Any two types with the same cardinality are
isomorphic, for example `boolean` and `0 | 1`. It is potentially possible to
define many valid isomorphisms between two types.

Added in v0.13.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Isomorphism (type alias)](#isomorphism-type-alias)
  - [fromIso](#fromiso)
  - [toIso](#toiso)

---

# utils

## Isomorphism (type alias)

An isomorphism is formed between two reversible, lossless functions. The
order of the types is irrelevant.

**Signature**

```ts
export type Isomorphism<A, B> = {
  to: (x: A) => B
  from: (x: B) => A
}
```

```hs
type Isomorphism a b = { to: a -> b, from: b -> a }
```

Added in v0.13.0

## fromIso

Convert a monocle-ts `Iso` to an `Isomorphism`.

**Signature**

```ts
export declare const fromIso: <A, B>(x: Iso<A, B>) => Isomorphism<A, B>
```

```hs
fromIso :: Iso a b -> Isomorphism a b
```

Added in v0.13.0

## toIso

Convert an `Isomorphism` to a monocle-ts `Iso`.

**Signature**

```ts
export declare const toIso: <A, B>(x: Isomorphism<A, B>) => Iso<A, B>
```

```hs
toIso :: Isomorphism a b -> Iso a b
```

Added in v0.13.0
