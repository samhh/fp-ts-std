---
title: Isomorphism.ts
nav_order: 15
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
  - [compose](#compose)
  - [deriveMonoid](#derivemonoid)
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

Added in v0.13.0

## compose

Isomorphisms can be composed together much like functions. Consider this
type signature a window into category theory!

**Signature**

```ts
export declare const compose: <A, B>(F: Isomorphism<A, B>) => <C>(G: Isomorphism<B, C>) => Isomorphism<A, C>
```

**Example**

```ts
import * as Iso from 'fp-ts-std/Isomorphism'
import { Isomorphism } from 'fp-ts-std/Isomorphism'
import * as E from 'fp-ts/Either'
import { Either } from 'fp-ts/Either'

type Side = Either<null, null>
type Binary = 0 | 1

const isoSideBool: Isomorphism<Side, boolean> = {
  to: E.isRight,
  from: (x) => (x ? E.right(null) : E.left(null)),
}

const isoBoolBinary: Isomorphism<boolean, Binary> = {
  to: (x) => (x ? 1 : 0),
  from: Boolean,
}

const isoSideBinary: Isomorphism<Side, Binary> = Iso.compose(isoSideBool)(isoBoolBinary)

assert.strictEqual(isoSideBinary.to(E.left(null)), 0)
assert.strictEqual(isoSideBinary.to(E.right(null)), 1)
assert.deepStrictEqual(isoSideBinary.from(0), E.left(null))
assert.deepStrictEqual(isoSideBinary.from(1), E.right(null))
```

Added in v0.13.0

## deriveMonoid

Derive a `Monoid` for `B` given a `Monoid` for `A` and an
`Isomorphism` between the two types.

**Signature**

```ts
export declare const deriveMonoid: <A, B>(I: Isomorphism<A, B>) => (M: Monoid<A>) => Monoid<B>
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

const monoidBinaryAll = Iso.deriveMonoid(isoBoolBinary)(Bool.MonoidAll)

assert.strictEqual(monoidBinaryAll.empty, 1)
assert.strictEqual(monoidBinaryAll.concat(0, 1), 0)
assert.strictEqual(monoidBinaryAll.concat(1, 1), 1)
```

Added in v0.13.0

## deriveSemigroup

Derive a `Semigroup` for `B` given a `Semigroup` for `A` and an
`Isomorphism` between the two types.

**Signature**

```ts
export declare const deriveSemigroup: <A, B>(I: Isomorphism<A, B>) => (S: Semigroup<A>) => Semigroup<B>
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

Added in v0.13.0

## reverse

Reverse the order of the types in an `Isomorphism`.

**Signature**

```ts
export declare const reverse: <A, B>(I: Isomorphism<A, B>) => Isomorphism<B, A>
```

Added in v0.13.0

## toIso

Convert an `Isomorphism` to a monocle-ts `Iso`.

**Signature**

```ts
export declare const toIso: <A, B>(I: Isomorphism<A, B>) => Iso<A, B>
```

Added in v0.13.0
