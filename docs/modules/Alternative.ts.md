---
title: Alternative.ts
nav_order: 1
parent: Modules
---

## Alternative overview

Utility functions to accommodate `fp-ts/Alternative`.

Added in v0.13.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [pureIf](#pureif)

---

# utils

## pureIf

Conditionally lifts a value to an `Alternative` context or returns
empty/zero. The lazy value is evaluated only if the condition passes.

**Signature**

```ts
export declare function pureIf<F extends URIS4, S, R, E>(
  F: Alternative4<F>
): (x: boolean) => <A>(y: Lazy<A>) => Kind4<F, S, R, E, A>
export declare function pureIf<F extends URIS3, R, E>(
  F: Alternative3<F>
): (x: boolean) => <A>(y: Lazy<A>) => Kind3<F, R, E, A>
export declare function pureIf<F extends URIS3, R, E>(
  F: Alternative3C<F, E>
): (x: boolean) => <A>(y: Lazy<A>) => Kind3<F, R, E, A>
export declare function pureIf<F extends URIS2, E>(
  F: Alternative2<F>
): (x: boolean) => <A>(y: Lazy<A>) => Kind2<F, E, A>
export declare function pureIf<F extends URIS2, E>(
  F: Alternative2C<F, E>
): (x: boolean) => <A>(y: Lazy<A>) => Kind2<F, E, A>
export declare function pureIf<F extends URIS>(F: Alternative1<F>): (x: boolean) => <A>(y: Lazy<A>) => Kind<F, A>
```

```hs
pureIf :: f extends URIS4 => Alternative4 f -> boolean -> Lazy a -> Kind4 f s r e a
pureIf :: f extends URIS3 => ((Alternative3 f) -> boolean -> Lazy a -> Kind3 f r e a)
pureIf :: f extends URIS3 => ((Alternative3C f e) -> boolean -> Lazy a -> Kind3 f r e a)
pureIf :: f extends URIS2 => ((Alternative2 f) -> boolean -> Lazy a -> Kind2 f e a)
pureIf :: f extends URIS2 => ((Alternative2C f e) -> boolean -> Lazy a -> Kind2 f e a)
pureIf :: f extends URIS => ((Alternative1 f) -> boolean -> Lazy a -> Kind f a)
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { pureIf } from 'fp-ts-std/Alternative'
import * as O from 'fp-ts/Option'
import { Predicate } from 'fp-ts/Predicate'

const person = { name: 'Hodor', age: 40 }
const isMagicNumber: Predicate<number> = (n) => n === 42

const mname = pureIf(O.Alternative)(isMagicNumber(person.age))(constant(person.name))
```

Added in v0.13.0
