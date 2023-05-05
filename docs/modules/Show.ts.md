---
title: Show.ts
nav_order: 37
parent: Modules
---

## Show overview

Utilities to accommodate `fp-ts/Show`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [1 Typeclass Instances](#1-typeclass-instances)
  - [Contravariant](#contravariant)
- [2 Typeclass Methods](#2-typeclass-methods)
  - [contramap](#contramap)
- [4 Minutiae](#4-minutiae)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)

---

# 1 Typeclass Instances

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

# 2 Typeclass Methods

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

**Example**

```ts
import { Show } from 'fp-ts/Show'
import * as Str from 'fp-ts/string'
import { contramap } from 'fp-ts-std/Show'

const showNum: Show<number> = contramap(String)(Str.Show)

assert.strictEqual(showNum.show(123), '"123"')
```

Added in v0.12.0

# 4 Minutiae

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
