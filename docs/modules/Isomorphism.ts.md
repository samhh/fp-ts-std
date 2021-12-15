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
  - [deriveSemigroup](#derivesemigroup)
  - [fromIso](#fromiso)
  - [reverse](#reverse)
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

## deriveSemigroup

Derive a `Semigroup` for `B` given a `Semigroup` for `A` and an
`Isomorphism` between the two types.

**Signature**

```ts
export declare const deriveSemigroup: <A, B>(I: Isomorphism<A, B>) => (S: Semigroup<A>) => Semigroup<B>
```

```hs
deriveSemigroup :: Isomorphism a b -> Semigroup a -> Semigroup b
```

**Example**

```ts
import * as Iso from 'fp-ts-std/Isomorphism'
import { Isomorphism } from 'fp-ts-std/Isomorphism'
import * as Bool from 'fp-ts/boolean'

type Binary = 0 | 1

const isoBoolBinary: Isomorphism<boolean, Binary> = {
  to: (x) => (x ? 1 : 0),
  from: Boolean,
}

const semigroupBinaryAll = Iso.deriveSemigroup(isoBoolBinary)(Bool.SemigroupAll)

assert.strictEqual(semigroupBinaryAll.concat(0, 1), 0)
assert.strictEqual(semigroupBinaryAll.concat(1, 1), 1)
```

Added in v0.13.0

## fromIso

Convert a monocle-ts `Iso` to an `Isomorphism`.

**Signature**

```ts
export declare const fromIso: <A, B>(I: Iso<A, B>) => Isomorphism<A, B>
```

```hs
fromIso :: Iso a b -> Isomorphism a b
```

Added in v0.13.0

## reverse

Reverse the order of the types in an `Isomorphism`.

**Signature**

```ts
export declare const reverse: <A, B>(I: Isomorphism<A, B>) => Isomorphism<B, A>
```

```hs
reverse :: Isomorphism a b -> Isomorphism b a
```

Added in v0.13.0

## toIso

Convert an `Isomorphism` to a monocle-ts `Iso`.

**Signature**

```ts
export declare const toIso: <A, B>(I: Isomorphism<A, B>) => Iso<A, B>
```

```hs
toIso :: Isomorphism a b -> Iso a b
```

Added in v0.13.0
