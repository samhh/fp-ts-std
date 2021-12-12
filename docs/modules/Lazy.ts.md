---
title: Lazy.ts
nav_order: 14
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
  - [map](#map)
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

```hs
ApT :: Lazy []
```

Added in v0.12.0

## Applicative

Formal `Applicative` instance for `Lazy` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const Applicative: Applicative1<'Lazy'>
```

```hs
Applicative :: Applicative1 "Lazy"
```

Added in v0.12.0

## Apply

Formal `Apply` instance for `Lazy` to be provided to higher-kinded functions
that require it.

**Signature**

```ts
export declare const Apply: Apply1<'Lazy'>
```

```hs
Apply :: Apply1 "Lazy"
```

Added in v0.12.0

## Chain

Formal `Chain` instance for `Lazy` to be provided to higher-kinded functions
that require it.

**Signature**

```ts
export declare const Chain: Chain1<'Lazy'>
```

```hs
Chain :: Chain1 "Lazy"
```

Added in v0.12.0

## ChainRec

Formal `ChainRec` instance for `Lazy` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const ChainRec: ChainRec1<'Lazy'>
```

```hs
ChainRec :: ChainRec1 "Lazy"
```

Added in v0.12.0

## Do

Initiate do notation in the context of `Lazy`.

**Signature**

```ts
export declare const Do: Lazy<{}>
```

```hs
Do :: Lazy {}
```

Added in v0.12.0

## Functor

Formal `Functor` instance for `Lazy` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const Functor: Functor1<'Lazy'>
```

```hs
Functor :: Functor1 "Lazy"
```

Added in v0.12.0

## Lazy

Re-exported from fp-ts for convenience.

**Signature**

```ts
export declare const Lazy: any
```

```hs
Lazy :: any
```

Added in v0.12.0

## Monad

Formal `Monad` instance for `Lazy` to be provided to higher-kinded functions
that require it.

**Signature**

```ts
export declare const Monad: Monad1<'Lazy'>
```

```hs
Monad :: Monad1 "Lazy"
```

Added in v0.12.0

## Pointed

Formal `Pointed` instance for `Lazy` to be provided to higher-kinded
functions that require it.

**Signature**

```ts
export declare const Pointed: Pointed1<'Lazy'>
```

```hs
Pointed :: Pointed1 "Lazy"
```

Added in v0.12.0

## URI

Typeclass machinery.

**Signature**

```ts
export declare const URI: 'Lazy'
```

```hs
URI :: "Lazy"
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

## ap

Apply a function within a `Lazy`.

**Signature**

```ts
export declare const ap: <A>(fa: Lazy<A>) => <B>(fab: Lazy<(a: A) => B>) => Lazy<B>
```

```hs
ap :: Lazy a -> Lazy (a -> b) -> Lazy b
```

Added in v0.12.0

## apFirst

Sequence actions, discarding the value of the first argument.

**Signature**

```ts
export declare const apFirst: <B>(second: Lazy<B>) => <A>(first: Lazy<A>) => Lazy<A>
```

```hs
apFirst :: Lazy b -> Lazy a -> Lazy a
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

```hs
apS :: (Exclude n (keyof a), Lazy b) -> Lazy a -> Lazy { [k in (n | (keyof a))]: k extends (keyof a) ? a[k] : b }
```

Added in v0.12.0

## apSecond

Sequence actions, discarding the value of the second argument.

**Signature**

```ts
export declare const apSecond: <B>(second: Lazy<B>) => <A>(first: Lazy<A>) => Lazy<B>
```

```hs
apSecond :: Lazy b -> Lazy a -> Lazy b
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

```hs
bind :: (Exclude n (keyof a), (a -> Lazy b)) -> Lazy a -> Lazy { [k in (n | (keyof a))]: k extends (keyof a) ? a[k] : b }
```

Added in v0.12.0

## bindTo

Bind the provided value, typically preceding it in a pipeline, to the
specified key in do notation.

**Signature**

```ts
export declare const bindTo: <N>(name: N) => <A>(fa: Lazy<A>) => Lazy<{ readonly [K in N]: A }>
```

```hs
bindTo :: n -> Lazy a -> Lazy { [k in n]: a }
```

Added in v0.12.0

## chain

Map and flatten the output of a `Lazy`.

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => Lazy<B>) => (ma: Lazy<A>) => Lazy<B>
```

```hs
chain :: (a -> Lazy b) -> Lazy a -> Lazy b
```

Added in v0.12.0

## chainFirst

Like `chain`, but discards the new output.

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => Lazy<B>) => (first: Lazy<A>) => Lazy<A>
```

```hs
chainFirst :: (a -> Lazy b) -> Lazy a -> Lazy a
```

Added in v0.12.0

## execute

Execute a `Lazy`, returning the value within. Helpful for staying within
function application and composition pipelines.

**Signature**

```ts
export declare const execute: <A>(x: Lazy<A>) => A
```

```hs
execute :: Lazy a -> a
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

```hs
flap :: a -> Lazy (a -> b) -> Lazy b
```

Added in v0.12.0

## flatten

Flatten a nested `Lazy`.

**Signature**

```ts
export declare const flatten: <A>(mma: Lazy<Lazy<A>>) => Lazy<A>
```

```hs
flatten :: Lazy (Lazy a) -> Lazy a
```

Added in v0.12.0

## map

Map the output of a `Lazy`.

**Signature**

```ts
export declare const map: <A, B>(f: (x: A) => B) => (fa: Lazy<A>) => Lazy<B>
```

```hs
map :: (a -> b) -> Lazy a -> Lazy b
```

Added in v0.12.0

## of

Raise any value to a `Lazy`.

**Signature**

```ts
export declare const of: <A>(a: A) => Lazy<A>
```

```hs
of :: a -> Lazy a
```

Added in v0.12.0

## sequenceArray

Equivalent to `Array#sequence(Applicative)`.

**Signature**

```ts
export declare const sequenceArray: <A>(arr: readonly Lazy<A>[]) => Lazy<readonly A[]>
```

```hs
sequenceArray :: Array (Lazy a) -> Lazy (Array a)
```

Added in v2.9.0

## traverseArray

Equivalent to `Array#traverse(Applicative)`.

**Signature**

```ts
export declare const traverseArray: <A, B>(f: (a: A) => Lazy<B>) => (as: readonly A[]) => Lazy<readonly B[]>
```

```hs
traverseArray :: (a -> Lazy b) -> Array a -> Lazy (Array b)
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

```hs
traverseArrayWithIndex :: ((number, a) -> Lazy b) -> Array a -> Lazy (Array b)
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

```hs
traverseReadonlyArrayWithIndex :: ((number, a) -> Lazy b) -> Array a -> Lazy (Array b)
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

```hs
traverseReadonlyNonEmptyArrayWithIndex :: ((number, a) -> Lazy b) -> ReadonlyNonEmptyArray a -> Lazy (ReadonlyNonEmptyArray b)
```

Added in v0.12.0
