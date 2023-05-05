---
title: Applicative.ts
nav_order: 2
parent: Modules
---

## Applicative overview

Utility functions to accommodate `fp-ts/Applicative`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [2 Typeclass Methods](#2-typeclass-methods)
  - [unless](#unless)
  - [when](#when)

---

# 2 Typeclass Methods

## unless

The reverse of `when`.

**Signature**

```ts
export declare function unless<F extends URIS4>(
  F: Applicative4<F>
): (b: boolean) => <S, R, E>(x: Kind4<F, S, R, E, void>) => Kind4<F, S, R, E, void>
export declare function unless<F extends URIS3>(
  F: Applicative3<F>
): (b: boolean) => <R, E>(x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export declare function unless<F extends URIS3, E>(
  F: Applicative3C<F, E>
): (b: boolean) => <R>(x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export declare function unless<F extends URIS2>(
  F: Applicative2<F>
): (b: boolean) => <E>(x: Kind2<F, E, void>) => Kind2<F, E, void>
export declare function unless<F extends URIS2, E>(
  F: Applicative2C<F, E>
): (b: boolean) => (x: Kind2<F, E, void>) => Kind2<F, E, void>
export declare function unless<F extends URIS>(F: Applicative1<F>): (b: boolean) => (x: Kind<F, void>) => Kind<F, void>
```

```hs
unless :: f extends URIS4 => Applicative4 f -> boolean -> Kind4 f s r e void -> Kind4 f s r e void
unless :: f extends URIS3 => ((Applicative3 f) -> boolean -> Kind3 f r e void -> Kind3 f r e void)
unless :: f extends URIS3 => ((Applicative3C f e) -> boolean -> Kind3 f r e void -> Kind3 f r e void)
unless :: f extends URIS2 => ((Applicative2 f) -> boolean -> Kind2 f e void -> Kind2 f e void)
unless :: f extends URIS2 => ((Applicative2C f e) -> boolean -> Kind2 f e void -> Kind2 f e void)
unless :: f extends URIS => ((Applicative1 f) -> boolean -> Kind f void -> Kind f void)
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/Predicate'
import { unless } from 'fp-ts-std/Applicative'
import * as IO from 'fp-ts/IO'
import * as IOE from 'fp-ts/IOEither'
import { log } from 'fp-ts/Console'

const isValid: Predicate<number> = (n) => n === 42

pipe(
  IOE.of(123),
  IOE.chainFirstIOK((n) => unless(IO.Applicative)(isValid(n))(log(n)))
)
```

Added in v0.12.0

## when

Conditional execution of an applicative. Helpful for conditional side effects
like logging.

**Signature**

```ts
export declare function when<F extends URIS4>(
  F: Applicative4<F>
): (b: boolean) => <S, R, E>(x: Kind4<F, S, R, E, void>) => Kind4<F, S, R, E, void>
export declare function when<F extends URIS3>(
  F: Applicative3<F>
): (b: boolean) => <R, E>(x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export declare function when<F extends URIS3, E>(
  F: Applicative3C<F, E>
): (b: boolean) => <R>(x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export declare function when<F extends URIS2>(
  F: Applicative2<F>
): (b: boolean) => <E>(x: Kind2<F, E, void>) => Kind2<F, E, void>
export declare function when<F extends URIS2, E>(
  F: Applicative2C<F, E>
): (b: boolean) => (x: Kind2<F, E, void>) => Kind2<F, E, void>
export declare function when<F extends URIS>(F: Applicative1<F>): (b: boolean) => (x: Kind<F, void>) => Kind<F, void>
```

```hs
when :: f extends URIS4 => Applicative4 f -> boolean -> Kind4 f s r e void -> Kind4 f s r e void
when :: f extends URIS3 => ((Applicative3 f) -> boolean -> Kind3 f r e void -> Kind3 f r e void)
when :: f extends URIS3 => ((Applicative3C f e) -> boolean -> Kind3 f r e void -> Kind3 f r e void)
when :: f extends URIS2 => ((Applicative2 f) -> boolean -> Kind2 f e void -> Kind2 f e void)
when :: f extends URIS2 => ((Applicative2C f e) -> boolean -> Kind2 f e void -> Kind2 f e void)
when :: f extends URIS => ((Applicative1 f) -> boolean -> Kind f void -> Kind f void)
```

**Example**

```ts
import { pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/Predicate'
import { when } from 'fp-ts-std/Applicative'
import * as IO from 'fp-ts/IO'
import * as IOE from 'fp-ts/IOEither'
import { log } from 'fp-ts/Console'

const isInvalid: Predicate<number> = (n) => n !== 42

pipe(
  IOE.of(123),
  IOE.chainFirstIOK((n) => when(IO.Applicative)(isInvalid(n))(log(n)))
)
```

Added in v0.12.0
