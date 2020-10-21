---
title: Boolean.ts
nav_order: 2
parent: Modules
---

## Boolean overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [allPass](#allpass)
  - [and](#and)
  - [anyPass](#anypass)
  - [invert](#invert)
  - [or](#or)
  - [xor](#xor)

---

# utils

## allPass

Given an array of predicates, returns a predicate that returns true if the
argument passes all of the predicates.

**Signature**

```ts
export declare const allPass: <A>(fs: Predicate<A>[]) => Predicate<A>
```

Added in v0.4.0

## and

Returns `true` if both arguments are `true`, else `false`. Equivalent to
logical conjunction.

**Signature**

```ts
export declare const and: (x: boolean) => Endomorphism<boolean>
```

Added in v0.4.0

## anyPass

Given an array of predicates, returns a predicate that returns true if the
argument passes any of the predicates.

**Signature**

```ts
export declare const anyPass: <A>(fs: Predicate<A>[]) => Predicate<A>
```

Added in v0.4.0

## invert

Invert a boolean.

**Signature**

```ts
export declare const invert: Endomorphism<boolean>
```

Added in v0.4.0

## or

Returns `true` if one or both arguments are `true`, else `false`. Equivalent
to logical disjunction.

**Signature**

```ts
export declare const or: (x: boolean) => Endomorphism<boolean>
```

Added in v0.4.0

## xor

Returns `true` if one argument is `true` and the other is `false`, else
`false`. Equivalent to exclusive logical disjunction.

**Signature**

```ts
export declare const xor: (x: boolean) => Endomorphism<boolean>
```

Added in v0.4.0
