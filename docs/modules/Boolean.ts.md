---
title: Boolean.ts
nav_order: 4
parent: Modules
---

## Boolean overview

Various functions to aid in working with booleans. You may also find the
`Predicate` module relevant.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [and](#and)
  - [invert](#invert)
  - [or](#or)
  - [xor](#xor)

---

# utils

## and

Returns `true` if both arguments are `true`, else `false`. Equivalent to
logical conjunction.

**Signature**

```ts
export declare const and: (x: boolean) => Endomorphism<boolean>
```

```hs
and :: boolean -> Endomorphism boolean
```

**Example**

```ts
import { and } from 'fp-ts-std/Boolean'

assert.strictEqual(and(true)(true), true)
assert.strictEqual(and(true)(false), false)
```

Added in v0.4.0

## invert

Invert a boolean.

**Signature**

```ts
export declare const invert: Endomorphism<boolean>
```

```hs
invert :: Endomorphism boolean
```

**Example**

```ts
import { invert } from 'fp-ts-std/Boolean'

assert.strictEqual(invert(true), false)
assert.strictEqual(invert(false), true)
```

Added in v0.4.0

## or

Returns `true` if one or both arguments are `true`, else `false`. Equivalent
to logical disjunction.

**Signature**

```ts
export declare const or: (x: boolean) => Endomorphism<boolean>
```

```hs
or :: boolean -> Endomorphism boolean
```

**Example**

```ts
import { or } from 'fp-ts-std/Boolean'

assert.strictEqual(or(true)(false), true)
assert.strictEqual(or(false)(false), false)
```

Added in v0.4.0

## xor

Returns `true` if one argument is `true` and the other is `false`, else
`false`. Equivalent to exclusive logical disjunction.

**Signature**

```ts
export declare const xor: (x: boolean) => Endomorphism<boolean>
```

```hs
xor :: boolean -> Endomorphism boolean
```

**Example**

```ts
import { xor } from 'fp-ts-std/Boolean'

assert.strictEqual(xor(true)(false), true)
assert.strictEqual(xor(true)(true), false)
```

Added in v0.4.0
