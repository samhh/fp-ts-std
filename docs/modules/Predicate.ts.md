---
title: Predicate.ts
nav_order: 23
parent: Modules
---

## Predicate overview

Various functions to aid in working with predicates. You may also find the
`Boolean` module relevant.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [allPass](#allpass)
  - [anyPass](#anypass)
  - [nonePass](#nonepass)

---

# utils

## allPass

Given an array of predicates, returns a predicate that returns true if the
argument passes all of the predicates.

**Signature**

```ts
export declare const allPass: <A>(fs: Predicate<A>[]) => Predicate<A>
```

```hs
allPass :: Array (Predicate a) -> Predicate a
```

**Example**

```ts
import { allPass } from 'fp-ts-std/Predicate'
import { Predicate } from 'fp-ts/Predicate'

const gt3: Predicate<number> = (n) => n > 3
const lt7: Predicate<number> = (n) => n < 7
const even: Predicate<number> = (n) => n % 2 === 0

assert.strictEqual(allPass([gt3, lt7, even])(4), true)
assert.strictEqual(allPass([gt3, lt7, even])(5), false)
```

Added in v0.12.0

## anyPass

Given an array of predicates, returns a predicate that returns true if the
argument passes any of the predicates.

**Signature**

```ts
export declare const anyPass: <A>(fs: Predicate<A>[]) => Predicate<A>
```

```hs
anyPass :: Array (Predicate a) -> Predicate a
```

**Example**

```ts
import { anyPass } from 'fp-ts-std/Predicate'
import { Predicate } from 'fp-ts/Predicate'

const lt3: Predicate<number> = (n) => n < 3
const gt7: Predicate<number> = (n) => n > 7
const even: Predicate<number> = (n) => n % 2 === 0

assert.strictEqual(anyPass([lt3, gt7, even])(4), true)
assert.strictEqual(anyPass([lt3, gt7, even])(5), false)
```

Added in v0.12.0

## nonePass

Given an array of predicates, returns a predicate that returns true if the
argument passes none of the predicates.

**Signature**

```ts
export declare const nonePass: <A>(fs: Predicate<A>[]) => Predicate<A>
```

```hs
nonePass :: Array (Predicate a) -> Predicate a
```

**Example**

```ts
import { nonePass } from 'fp-ts-std/Predicate'
import { Predicate } from 'fp-ts/Predicate'

const lt3: Predicate<number> = (n) => n < 3
const gt7: Predicate<number> = (n) => n > 7
const even: Predicate<number> = (n) => n % 2 === 0

assert.strictEqual(nonePass([lt3, gt7, even])(4), false)
assert.strictEqual(nonePass([lt3, gt7, even])(5), true)
```

Added in v0.12.0
