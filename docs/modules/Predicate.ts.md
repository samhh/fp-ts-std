---
title: Predicate.ts
nav_order: 16
parent: Modules
---

## Predicate overview

Various functions to aid in working with predicates. You may also find the
`Boolean` module relevant.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [allPass](#allpass)
  - [anyPass](#anypass)
  - [both](#both)
  - [either](#either)

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

Added in v0.4.0

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

Added in v0.4.0

## both

Combine two predicates under conjunction in short-circuited fashion.

**Signature**

```ts
export declare const both: <A>(a: Predicate<A>) => (b: Predicate<A>) => Predicate<A>
```

```hs
both :: Predicate a -> Predicate a -> Predicate a
```

**Example**

```ts
import { both } from 'fp-ts-std/Predicate'
import { Predicate } from 'fp-ts/Predicate'

const gt5: Predicate<number> = (x) => x > 5
const lt10: Predicate<number> = (x) => x < 10
const gt5AndLt10: Predicate<number> = both(gt5)(lt10)

assert.strictEqual(gt5AndLt10(3), false)
assert.strictEqual(gt5AndLt10(8), true)
assert.strictEqual(gt5AndLt10(12), false)
```

Added in v0.5.0

## either

Combine two predicates under disjunction in short-circuited fashion.

**Signature**

```ts
export declare const either: <A>(a: Predicate<A>) => (b: Predicate<A>) => Predicate<A>
```

```hs
either :: Predicate a -> Predicate a -> Predicate a
```

**Example**

```ts
import { either } from 'fp-ts-std/Predicate'
import { Predicate } from 'fp-ts/Predicate'

const lt5: Predicate<number> = (x) => x < 5
const gt10: Predicate<number> = (x) => x > 10
const lt5OrGt10: Predicate<number> = either(lt5)(gt10)

assert.strictEqual(lt5OrGt10(3), true)
assert.strictEqual(lt5OrGt10(8), false)
assert.strictEqual(lt5OrGt10(12), true)
```

Added in v0.5.0
