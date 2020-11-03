---
title: Array.ts
nav_order: 1
parent: Modules
---

## Array overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [all](#all)
  - [any](#any)
  - [elemFlipped](#elemflipped)
  - [getDisorderedEq](#getdisorderedeq)
  - [insertMany](#insertmany)
  - [join](#join)
  - [length](#length)
  - [pluckFirst](#pluckfirst)
  - [upsert](#upsert)

---

# utils

## all

Check if a predicate holds true for every array member.

**Signature**

```ts
export declare const all: <A>(f: Predicate<A>) => Predicate<A[]>
```

**Example**

```ts
import { all } from 'fp-ts-std/Array'
import { Predicate } from 'fp-ts/function'

const isFive: Predicate<number> = (n) => n === 5
const isAllFive = all(isFive)

assert.strictEqual(isAllFive([5, 5, 5]), true)
assert.strictEqual(isAllFive([5, 4, 5]), false)
```

Added in v0.1.0

## any

Check if a predicate holds true for any array member.

**Signature**

```ts
export declare const any: <A>(f: Predicate<A>) => Predicate<A[]>
```

**Example**

```ts
import { any } from 'fp-ts-std/Array'
import { Predicate } from 'fp-ts/function'

const isFive: Predicate<number> = (n) => n === 5
const isAnyFive = any(isFive)

assert.strictEqual(isAnyFive([3, 5, 7]), true)
assert.strictEqual(isAnyFive([3, 4, 7]), false)
```

Added in v0.1.0

## elemFlipped

Like `fp-ts/Array::elem`, but flipped.

**Signature**

```ts
export declare const elemFlipped: <A>(eq: Eq<A>) => (xs: A[]) => Predicate<A>
```

**Example**

```ts
import { elemFlipped } from 'fp-ts-std/Array'
import { eqString } from 'fp-ts/Eq'

const isLowerVowel = elemFlipped(eqString)(['a', 'e', 'i', 'o', 'u'])

assert.strictEqual(isLowerVowel('a'), true)
assert.strictEqual(isLowerVowel('b'), false)
```

Added in v0.1.0

## getDisorderedEq

Like `fp-ts/Array::getEq`, but items are not required to be in the same
order to determine equivalence. This function is therefore less efficient,
and `getEq` should be preferred on ordered data.

**Signature**

```ts
export declare const getDisorderedEq: <A>(ordA: Ord<A>) => Eq<A[]>
```

**Example**

```ts
import { getEq } from 'fp-ts/Array'
import { getDisorderedEq } from 'fp-ts-std/Array'
import { ordNumber } from 'fp-ts/Ord'

const f = getEq(ordNumber)
const g = getDisorderedEq(ordNumber)

assert.strictEqual(f.equals([1, 2, 3], [1, 3, 2]), false)
assert.strictEqual(g.equals([1, 2, 3], [1, 3, 2]), true)
```

Added in v0.1.0

## insertMany

Insert all the elements of an array into another array at the specified
index. Returns `None` if the index is out of bounds.

The array of elements to insert must be non-empty.

**Signature**

```ts
export declare const insertMany: (i: number) => <A>(xs: NonEmptyArray<A>) => (ys: A[]) => Option<NonEmptyArray<A>>
```

**Example**

```ts
import { insertMany } from 'fp-ts-std/Array'
import * as O from 'fp-ts/Option'

const f = insertMany(1)(['a', 'b'])
assert.deepStrictEqual(f([]), O.none)
assert.deepStrictEqual(f(['x']), O.some(['x', 'a', 'b']))
assert.deepStrictEqual(f(['x', 'y']), O.some(['x', 'a', 'b', 'y']))
```

Added in v0.5.0

## join

Join an array of strings together into a single string using the supplied
separator.

**Signature**

```ts
export declare const join: (x: string) => (ys: string[]) => string
```

**Example**

```ts
import { join } from 'fp-ts-std/Array'

const commaSepd = join(',')

assert.strictEqual(commaSepd([]), '')
assert.strictEqual(commaSepd(['a']), 'a')
assert.strictEqual(commaSepd(['a', 'b', 'c']), 'a,b,c')
```

Added in v0.1.0

## length

Get the length of an array.

**Signature**

```ts
export declare const length: (xs: unknown[]) => number
```

**Example**

```ts
import { length } from 'fp-ts-std/Array'

assert.strictEqual(length(['a', 'b', 'c']), 3)
```

Added in v0.1.0

## pluckFirst

Pluck the first item out of an array matching a predicate. Any further
matches will be left untouched.

This can be thought of as analagous to `fp-ts/Array::findFirst` where
the remaining items, sans the match (if any), are returned as well.

**Signature**

```ts
export declare const pluckFirst: <A>(p: Predicate<A>) => (xs: A[]) => [Option<A>, A[]]
```

**Example**

```ts
import { pluckFirst } from 'fp-ts-std/Array'
import * as O from 'fp-ts/Option'
import { Predicate } from 'fp-ts/function'

const isOverFive: Predicate<number> = (n) => n > 5
const pluckFirstOverFive = pluckFirst(isOverFive)

assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5]), [O.none, [1, 3, 5]])
assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5, 7, 9]), [O.some(7), [1, 3, 5, 9]])
```

Added in v0.1.0

## upsert

Update an item in an array or, if it's not present yet, insert it.

If the item exists more than once (as determined by the supplied `Eq`
instance), only the first to be found will be updated. The order in which
the array is checked is unspecified.

**Signature**

```ts
export declare const upsert: <A>(eqA: Eq<A>) => (x: A) => (ys: A[]) => NonEmptyArray<A>
```

**Example**

```ts
import { upsert } from 'fp-ts-std/Array'
import { eqString, contramap } from 'fp-ts/Eq'

type Account = {
  id: string
  name: string
}

const eqAccount = contramap<string, Account>((acc) => acc.id)(eqString)

const accounts: Array<Account> = [
  {
    id: 'a',
    name: 'an account',
  },
  {
    id: 'b',
    name: 'another account',
  },
]

const created: Account = {
  id: 'c',
  name: 'yet another account',
}

const updated: Account = {
  id: 'b',
  name: 'renamed account name',
}

const upsertAccount = upsert(eqAccount)

assert.deepStrictEqual(upsertAccount(created)(accounts), [accounts[0], accounts[1], created])
assert.deepStrictEqual(upsertAccount(updated)(accounts), [accounts[0], updated])
```

Added in v0.1.0
