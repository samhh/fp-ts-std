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
  - [altAllBy](#altallby)
  - [pureIf](#pureif)

---

# utils

## altAllBy

Like `altAll`, but flaps an input across an array of functions to produce
the `Alternative` values, short-circuiting upon a non-empty value. Useful for
`Alternative` types without inherent laziness.

**Signature**

```ts
export declare function altAllBy<F extends URIS4>(
  F: Alternative4<F>
): <S, R, E, B, A>(fs: Array<(x: A) => Kind4<F, S, R, E, B>>) => (x: A) => Kind4<F, S, R, E, B>
export declare function altAllBy<F extends URIS3>(
  F: Alternative3<F>
): <R, E, B, A>(fs: Array<(x: A) => Kind3<F, R, E, B>>) => (x: A) => Kind3<F, R, E, B>
export declare function altAllBy<F extends URIS3, E>(
  F: Alternative3C<F, E>
): <R, B, A>(fs: Array<(x: A) => Kind3<F, R, E, B>>) => (x: A) => Kind3<F, R, E, B>
export declare function altAllBy<F extends URIS2>(
  F: Alternative2<F>
): <E, B, A>(fs: Array<(x: A) => Kind2<F, E, B>>) => (x: A) => Kind2<F, E, B>
export declare function altAllBy<F extends URIS2, E>(
  F: Alternative2C<F, E>
): <B, A>(fs: Array<(x: A) => Kind2<F, E, B>>) => (x: A) => Kind2<F, E, B>
export declare function altAllBy<F extends URIS>(
  F: Alternative1<F>
): <B, A>(fs: Array<(x: A) => Kind<F, B>>) => (x: A) => Kind<F, B>
export declare function altAllBy<F>(F: Alternative<F>): <B, A>(fs: Array<(x: A) => HKT<F, B>>) => (x: A) => HKT<F, B>
```

```hs
altAllBy :: f extends URIS4 => Alternative4 f -> Array (a -> (Kind4 f s r e b)) -> a -> Kind4 f s r e b
altAllBy :: f extends URIS3 => ((Alternative3 f) -> Array (a -> (Kind3 f r e b)) -> a -> Kind3 f r e b)
altAllBy :: f extends URIS3 => ((Alternative3C f e) -> Array (a -> (Kind3 f r e b)) -> a -> Kind3 f r e b)
altAllBy :: f extends URIS2 => ((Alternative2 f) -> Array (a -> (Kind2 f e b)) -> a -> Kind2 f e b)
altAllBy :: f extends URIS2 => ((Alternative2C f e) -> Array (a -> (Kind2 f e b)) -> a -> Kind2 f e b)
altAllBy :: f extends URIS => ((Alternative1 f) -> Array (a -> (Kind f b)) -> a -> Kind f b)
altAllBy :: ((Alternative f) -> Array (a -> (HKT f b)) -> a -> HKT f b)
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { altAllBy } from 'fp-ts-std/Alternative'
import * as O from 'fp-ts/Option'

const f = altAllBy(O.Alternative)

assert.deepStrictEqual(f([constant(O.none), O.some])('foo'), O.some('foo'))
```

Added in v0.15.0

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
