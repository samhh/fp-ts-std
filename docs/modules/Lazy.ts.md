---
title: Lazy.ts
nav_order: 17
parent: Modules
---

## Lazy overview

Whilst the definition of `Lazy` happens to be the same as `IO`, they
represent different intentions, specifically with respect to `Lazy`
representing a pure thunk.

Thinking in terms of Haskell, `Lazy` can be considered equivalent to a pure
function that takes `()` (unit) as input.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [ApT](#apt)
  - [Applicative](#applicative)
  - [Apply](#apply)
  - [Chain](#chain)
  - [ChainRec](#chainrec)
  - [Do](#do)
  - [Functor](#functor)
  - [Lazy](#lazy)
  - [Monad](#monad)
  - [Pointed](#pointed)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [ap](#ap)
  - [apFirst](#apfirst)
  - [apS](#aps)
  - [apSecond](#apsecond)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [chain](#chain)
  - [chainFirst](#chainfirst)
  - [execute](#execute)
  - [flap](#flap)
  - [flatten](#flatten)
  - [lazy](#lazy)
  - [map](#map)
  - [memoize](#memoize)
  - [of](#of)
  - [sequenceArray](#sequencearray)
  - [traverseArray](#traversearray)
  - [traverseArrayWithIndex](#traversearraywithindex)
  - [traverseReadonlyArrayWithIndex](#traversereadonlyarraywithindex)
  - [traverseReadonlyNonEmptyArrayWithIndex](#traversereadonlynonemptyarraywithindex)

---

# utils

## ApT

Identity for `Lazy` as applied to `sequenceT`.

**Signature**

```ts
export declare const ApT: Lazy<readonly []>
```

Added in v0.12.0

## Applicative

Formal `Applicative` instance for `Lazy` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const Applicative: Applicative1<'Lazy'>
```

Added in v0.12.0

## Apply

Formal `Apply` instance for `Lazy` to be provided to higher-kinded functions
that require it.

**Signature**

```ts
export declare const Apply: Apply1<'Lazy'>
```

Added in v0.12.0

## Chain

Formal `Chain` instance for `Lazy` to be provided to higher-kinded functions
that require it.

**Signature**

```ts
export declare const Chain: Chain1<'Lazy'>
```

Added in v0.12.0

## ChainRec

Formal `ChainRec` instance for `Lazy` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const ChainRec: ChainRec1<'Lazy'>
```

Added in v0.12.0

## Do

Initiate do notation in the context of `Lazy`.

**Signature**

```ts
export declare const Do: Lazy<{}>
```

Added in v0.12.0

## Functor

Formal `Functor` instance for `Lazy` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const Functor: Functor1<'Lazy'>
```

Added in v0.12.0

## Lazy

Re-exported from fp-ts for convenience.

**Signature**

```ts
export declare const Lazy: any
```

Added in v0.12.0

## Monad

Formal `Monad` instance for `Lazy` to be provided to higher-kinded functions
that require it.

**Signature**

```ts
export declare const Monad: Monad1<'Lazy'>
```

Added in v0.12.0

## Pointed

Formal `Pointed` instance for `Lazy` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const Pointed: Pointed1<'Lazy'>
```

Added in v0.12.0

## URI

Typeclass machinery.

**Signature**

```ts
export declare const URI: 'Lazy'
```

Added in v0.12.0

## URI (type alias)

Typeclass machinery.

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.12.0

## ap

Apply a function within a `Lazy`.

**Signature**

```ts
export declare const ap: <A>(fa: Lazy<A>) => <B>(fab: Lazy<(a: A) => B>) => Lazy<B>
```

Added in v0.12.0

## apFirst

Sequence actions, discarding the value of the first argument.

**Signature**

```ts
export declare const apFirst: <B>(second: Lazy<B>) => <A>(first: Lazy<A>) => Lazy<A>
```

Added in v0.12.0

## apS

Bind the provided value to the specified key in do notation.

**Signature**

```ts
export declare const apS: <N, A, B>(
  name: Exclude<N, keyof A>,
  fb: Lazy<B>
) => (fa: Lazy<A>) => Lazy<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v0.12.0

## apSecond

Sequence actions, discarding the value of the second argument.

**Signature**

```ts
export declare const apSecond: <B>(second: Lazy<B>) => <A>(first: Lazy<A>) => Lazy<B>
```

Added in v0.12.0

## bind

Bind the output of the provided function to the specified key in do notation.

**Signature**

```ts
export declare const bind: <N, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Lazy<B>
) => (ma: Lazy<A>) => Lazy<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v0.12.0

## bindTo

Bind the provided value, typically preceding it in a pipeline, to the
specified key in do notation.

**Signature**

```ts
export declare const bindTo: <N>(name: N) => <A>(fa: Lazy<A>) => Lazy<{ readonly [K in N]: A }>
```

Added in v0.12.0

## chain

Map and flatten the output of a `Lazy`.

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => Lazy<B>) => (ma: Lazy<A>) => Lazy<B>
```

Added in v0.12.0

## chainFirst

Like `chain`, but discards the new output.

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => Lazy<B>) => (first: Lazy<A>) => Lazy<A>
```

Added in v0.12.0

## execute

Execute a `Lazy`, returning the value within. Helpful for staying within
function application and composition pipelines.

**Signature**

```ts
export declare const execute: <A>(x: Lazy<A>) => A
```

**Example**

```ts
import * as Lazy from 'fp-ts-std/Lazy'

assert.strictEqual(Lazy.execute(Lazy.of(5)), 5)
```

Added in v0.12.0

## flap

Takes a function in a functorial `Lazy` context and applies it to an
ordinary value.

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(fab: Lazy<(a: A) => B>) => Lazy<B>
```

Added in v0.12.0

## flatten

Flatten a nested `Lazy`.

**Signature**

```ts
export declare const flatten: <A>(mma: Lazy<Lazy<A>>) => Lazy<A>
```

Added in v0.12.0

## lazy

A constructor for `Lazy` values. Given `Lazy` is a type alias around
`() => A`, this function's only purpose is to aid in readability and express
intentional laziness, as opposed to for example forgetting or opting not to
use `constant`.

**Signature**

```ts
export declare const lazy: <A>(f: () => A) => Lazy<A>
```

**Example**

```ts
import { lazy } from 'fp-ts-std/Lazy'

const calc = lazy(() => 'do something expensive here')
```

Added in v0.13.0

## map

Map the output of a `Lazy`.

**Signature**

```ts
export declare const map: <A, B>(f: (x: A) => B) => (fa: Lazy<A>) => Lazy<B>
```

Added in v0.12.0

## memoize

Memoize a `Lazy`. Provided the input function is pure, this function is too.

**Signature**

```ts
export declare const memoize: <A>(f: Lazy<A>) => Lazy<A>
```

**Example**

```ts
import { lazy, memoize } from 'fp-ts-std/Lazy'

const expensive = lazy(() => 42)
const payOnce = memoize(expensive)

assert.strictEqual(payOnce(), payOnce())
```

Added in v0.14.0

## of

Raise any value to a `Lazy`.

**Signature**

```ts
export declare const of: <A>(a: A) => Lazy<A>
```

Added in v0.12.0

## sequenceArray

Equivalent to `Array#sequence(Applicative)`.

**Signature**

```ts
export declare const sequenceArray: <A>(arr: readonly Lazy<A>[]) => Lazy<readonly A[]>
```

Added in v2.9.0

## traverseArray

Equivalent to `Array#traverse(Applicative)`.

**Signature**

```ts
export declare const traverseArray: <A, B>(f: (a: A) => Lazy<B>) => (as: readonly A[]) => Lazy<readonly B[]>
```

Added in v0.12.0

## traverseArrayWithIndex

Equivalent to `Array#traverseWithIndex(Applicative)`.

**Signature**

```ts
export declare const traverseArrayWithIndex: <A, B>(
  f: (index: number, a: A) => Lazy<B>
) => (as: readonly A[]) => Lazy<readonly B[]>
```

Added in v0.12.0

## traverseReadonlyArrayWithIndex

Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.

**Signature**

```ts
export declare const traverseReadonlyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => Lazy<B>
) => (as: readonly A[]) => Lazy<readonly B[]>
```

Added in v0.12.0

## traverseReadonlyNonEmptyArrayWithIndex

Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.

**Signature**

```ts
export declare const traverseReadonlyNonEmptyArrayWithIndex: <A, B>(
  f: (index: number, a: A) => Lazy<B>
) => (as: ReadonlyNonEmptyArray<A>) => Lazy<ReadonlyNonEmptyArray<B>>
```

Added in v0.12.0
