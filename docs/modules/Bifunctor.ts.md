---
title: Bifunctor.ts
nav_order: 4
parent: Modules
---

## Bifunctor overview

Utility functions to accommodate `fp-ts/Bifunctor`.

Added in v0.14.0

---

<h2 class="text-delta">Table of contents</h2>

- [2 Typeclass Methods](#2-typeclass-methods)
  - [mapBoth](#mapboth)

---

# 2 Typeclass Methods

## mapBoth

Apply a function to both elements of a bifunctor.

**Signature**

```ts
export declare function mapBoth<F extends URIS4>(
  F: Bifunctor4<F>
): <A, B>(f: (x: A) => B) => <S, R>(x: Kind4<F, S, R, A, A>) => Kind4<F, S, R, B, B>
export declare function mapBoth<F extends URIS3>(
  F: Bifunctor3<F>
): <A, B>(f: (x: A) => B) => <R>(x: Kind3<F, R, A, A>) => Kind3<F, R, B, B>
export declare function mapBoth<F extends URIS3, E>(
  F: Bifunctor3C<F, E>
): <B>(f: (x: E) => B) => <R>(x: Kind3<F, R, E, E>) => Kind3<F, R, B, B>
export declare function mapBoth<F extends URIS2>(
  F: Bifunctor2<F>
): <A, B>(f: (x: A) => B) => (x: Kind2<F, A, A>) => Kind2<F, B, B>
export declare function mapBoth<F extends URIS2, E>(
  F: Bifunctor2C<F, E>
): <B>(f: (x: E) => B) => (x: Kind2<F, E, E>) => Kind2<F, B, B>
export declare function mapBoth<F extends URIS2>(
  F: Bifunctor<F>
): <A, B>(f: (x: A) => B) => (x: Kind2<F, A, A>) => Kind2<F, B, B>
```

```hs
mapBoth :: f extends URIS4 => Bifunctor4 f -> (a -> b) -> Kind4 f s r a a -> Kind4 f s r b b
mapBoth :: f extends URIS3 => ((Bifunctor3 f) -> (a -> b) -> Kind3 f r a a -> Kind3 f r b b)
mapBoth :: f extends URIS3 => ((Bifunctor3C f e) -> (e -> b) -> Kind3 f r e e -> Kind3 f r b b)
mapBoth :: f extends URIS2 => ((Bifunctor2 f) -> (a -> b) -> Kind2 f a a -> Kind2 f b b)
mapBoth :: f extends URIS2 => ((Bifunctor2C f e) -> (e -> b) -> Kind2 f e e -> Kind2 f b b)
mapBoth :: f extends URIS2 => ((Bifunctor f) -> (a -> b) -> Kind2 f a a -> Kind2 f b b)
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { mapBoth } from 'fp-ts-std/Bifunctor'
import * as Tuple from 'fp-ts/Tuple'
import { multiply } from 'fp-ts-std/Number'

const xs = pipe([3, 5], mapBoth(Tuple.Bifunctor)(multiply(2)))

assert.deepStrictEqual(xs, [6, 10])
```

Added in v0.14.0
