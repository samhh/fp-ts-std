---
title: Monoid.ts
nav_order: 19
parent: Modules
---

## Monoid overview

Utility functions to accommodate `fp-ts/Monoid`.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [memptyUnless](#memptyunless)
  - [memptyWhen](#memptywhen)
  - [toMonoid](#tomonoid)

---

# utils

## memptyUnless

Conditionally returns the provided monoidal value or its identity. The dual
to `memptyWhen`. The lazy value is evaluated only if the condition passes.

**Signature**

```ts
export declare const memptyUnless: <A>(M: Monoid<A>) => (x: boolean) => (y: Lazy<A>) => A
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { memptyUnless } from 'fp-ts-std/Monoid'
import * as O from 'fp-ts/Option'
import * as Str from 'fp-ts/string'

const f = memptyUnless(O.getMonoid(Str.Monoid))

assert.deepStrictEqual(f(true)(constant(O.some('x'))), O.some('x'))
assert.deepStrictEqual(f(true)(constant(O.none)), O.none)
assert.deepStrictEqual(f(false)(constant(O.some('x'))), O.none)
assert.deepStrictEqual(f(false)(constant(O.none)), O.none)
```

Added in v0.13.0

## memptyWhen

Conditionally returns the provided monoidal value or its identity. The dual
to `memptyUnless`. The lazy value is evaluated only if the condition passes.

**Signature**

```ts
export declare const memptyWhen: <A>(M: Monoid<A>) => (x: boolean) => (y: Lazy<A>) => A
```

**Example**

```ts
import { constant } from 'fp-ts/function'
import { memptyWhen } from 'fp-ts-std/Monoid'
import * as O from 'fp-ts/Option'
import * as Str from 'fp-ts/string'

const f = memptyWhen(O.getMonoid(Str.Monoid))

assert.deepStrictEqual(f(true)(constant(O.some('x'))), O.none)
assert.deepStrictEqual(f(true)(constant(O.none)), O.none)
assert.deepStrictEqual(f(false)(constant(O.some('x'))), O.some('x'))
assert.deepStrictEqual(f(false)(constant(O.none)), O.none)
```

Added in v0.13.0

## toMonoid

Extracts the value from within a foldable, falling back to the monoidal
identity of said value.

**Signature**

```ts
export declare function toMonoid<F extends URIS4>(
  F: Foldable4<F>
): <A, S, R, E>(G: Monoid<A>) => (x: Kind4<F, S, R, E, A>) => A
export declare function toMonoid<F extends URIS3>(
  F: Foldable3<F>
): <A, R, E>(G: Monoid<A>) => (x: Kind3<F, R, E, A>) => A
export declare function toMonoid<F extends URIS3, E>(
  F: Foldable3C<F, E>
): <A, R>(G: Monoid<A>) => (x: Kind3<F, R, E, A>) => A
export declare function toMonoid<F extends URIS2>(F: Foldable2<F>): <A, E>(G: Monoid<A>) => (x: Kind2<F, E, A>) => A
export declare function toMonoid<F extends URIS2, E>(F: Foldable2C<F, E>): <A>(G: Monoid<A>) => (x: Kind2<F, E, A>) => A
export declare function toMonoid<F extends URIS>(F: Foldable1<F>): <A>(G: Monoid<A>) => (x: Kind<F, A>) => A
```

**Example**

```ts
import { toMonoid } from 'fp-ts-std/Monoid'
import * as O from 'fp-ts/Option'
import * as Str from 'fp-ts/string'

const f = toMonoid(O.Foldable)(Str.Monoid)

assert.deepStrictEqual(f(O.some('x')), 'x')
assert.deepStrictEqual(f(O.none), '')
```

Added in v0.12.0
