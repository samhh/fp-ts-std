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
  - [aperture](#aperture)
  - [cartesian](#cartesian)
  - [countBy](#countby)
  - [dropRepeats](#droprepeats)
  - [dropRightWhile](#droprightwhile)
  - [elemFlipped](#elemflipped)
  - [endsWith](#endswith)
  - [getDisorderedEq](#getdisorderedeq)
  - [insertMany](#insertmany)
  - [join](#join)
  - [length](#length)
  - [mean](#mean)
  - [moveFrom](#movefrom)
  - [moveTo](#moveto)
  - [none](#none)
  - [pluckFirst](#pluckfirst)
  - [product](#product)
  - [reject](#reject)
  - [slice](#slice)
  - [startsWith](#startswith)
  - [sum](#sum)
  - [upsert](#upsert)
  - [without](#without)

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

## aperture

Returns an array of tuples of the specified length occupied by consecutive
elements.

If `n` is not a positive number, an empty array is returned.

If `n` is greater than the length of the array, an empty array is returned.

**Signature**

```ts
export declare const aperture: (n: number) => <A>(xs: A[]) => A[][]
```

**Example**

```ts
import { aperture } from 'fp-ts-std/Array'

assert.deepStrictEqual(aperture(1)([1, 2, 3, 4]), [[1], [2], [3], [4]])
assert.deepStrictEqual(aperture(2)([1, 2, 3, 4]), [
  [1, 2],
  [2, 3],
  [3, 4],
])
assert.deepStrictEqual(aperture(3)([1, 2, 3, 4]), [
  [1, 2, 3],
  [2, 3, 4],
])
assert.deepStrictEqual(aperture(4)([1, 2, 3, 4]), [[1, 2, 3, 4]])
```

Added in v0.7.0

## cartesian

Returns the {@link https://en.wikipedia.org/wiki/Cartesian_product Cartesian product}
of two arrays. In other words, returns an array containing tuples of every
possible ordered combination of the two input arrays.

**Signature**

```ts
export declare const cartesian: <A>(xs: A[]) => <B>(ys: B[]) => [A, B][]
```

**Example**

```ts
import { cartesian } from 'fp-ts-std/Array'

assert.deepStrictEqual(cartesian([1, 2])(['a', 'b', 'c']), [
  [1, 'a'],
  [1, 'b'],
  [1, 'c'],
  [2, 'a'],
  [2, 'b'],
  [2, 'c'],
])
```

Added in v0.6.0

## countBy

Map each item of an array to a key, and count how many map to each key.

**Signature**

```ts
export declare const countBy: <A>(f: (x: A) => string) => (xs: A[]) => Record<string, number>
```

**Example**

```ts
import { countBy } from 'fp-ts-std/Array'
import { toLower } from 'fp-ts-std/String'

const f = countBy(toLower)
const xs = ['A', 'b', 'C', 'a', 'e', 'A']

assert.deepStrictEqual(f(xs), { a: 3, b: 1, c: 1, e: 1 })
```

Added in v0.7.0

## dropRepeats

Filter a list, removing any elements that repeat that directly preceding
them.

**Signature**

```ts
export declare const dropRepeats: <A>(eq: Eq<A>) => Endomorphism<A[]>
```

**Example**

```ts
import { dropRepeats } from 'fp-ts-std/Array'
import { eqNumber } from 'fp-ts/Eq'

assert.deepStrictEqual(dropRepeats(eqNumber)([1, 2, 2, 3, 2, 4, 4]), [1, 2, 3, 2, 4])
```

Added in v0.6.0

## dropRightWhile

Remove the longest initial subarray from the end of the input array for
which all elements satisfy the specified predicate, creating a new array.

**Signature**

```ts
export declare const dropRightWhile: <A>(f: Predicate<A>) => Endomorphism<A[]>
```

**Example**

```ts
import { dropRightWhile } from 'fp-ts-std/Array'
import { Predicate } from 'fp-ts/function'

const isEven: Predicate<number> = (n) => n % 2 === 0
const dropRightEvens = dropRightWhile(isEven)

assert.deepStrictEqual(dropRightEvens([6, 7, 3, 4, 2]), [6, 7, 3])
```

Added in v0.7.0

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

## endsWith

Check if an array ends with the specified subarray.

**Signature**

```ts
export declare const endsWith: <A>(eq: Eq<A>) => (end: A[]) => Predicate<A[]>
```

**Example**

```ts
import { endsWith } from 'fp-ts-std/Array'
import { eqString } from 'fp-ts/Eq'

const endsXyz = endsWith(eqString)(['x', 'y', 'z'])

assert.strictEqual(endsXyz(['a', 'x', 'y', 'z']), true)
assert.strictEqual(endsXyz(['a', 'x', 'b', 'z']), false)
```

Added in v0.6.0

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

## mean

Calculate the mean of an array of numbers.

**Signature**

```ts
export declare const mean: (xs: NonEmptyArray<number>) => number
```

**Example**

```ts
import { mean } from 'fp-ts-std/Array'

assert.deepStrictEqual(mean([2, 7, 9]), 6)
```

Added in v0.7.0

## moveFrom

Move an item at index `from` to index `to`. See also `moveTo`.

If either index is out of bounds, `None` is returned.

If both indices are the same, the array is returned unchanged.

**Signature**

```ts
export declare const moveFrom: (from: number) => (to: number) => <A>(xs: A[]) => Option<A[]>
```

**Example**

```ts
import { moveFrom } from 'fp-ts-std/Array'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(moveFrom(0)(1)(['a', 'b', 'c']), O.some(['b', 'a', 'c']))
assert.deepStrictEqual(moveFrom(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']))
assert.deepStrictEqual(moveFrom(0)(0)([]), O.none)
assert.deepStrictEqual(moveFrom(0)(1)(['a']), O.none)
assert.deepStrictEqual(moveFrom(1)(0)(['a']), O.none)
```

Added in v0.7.0

## moveTo

Move an item at index `from` to index `to`. See also `moveFrom`.

If either index is out of bounds, `None` is returned.

If both indices are the same, the array is returned unchanged.

**Signature**

```ts
export declare const moveTo: (to: number) => (from: number) => <A>(xs: A[]) => Option<A[]>
```

**Example**

```ts
import { moveTo } from 'fp-ts-std/Array'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(moveTo(1)(0)(['a', 'b', 'c']), O.some(['b', 'a', 'c']))
assert.deepStrictEqual(moveTo(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']))
assert.deepStrictEqual(moveTo(0)(0)([]), O.none)
assert.deepStrictEqual(moveTo(0)(1)(['a']), O.none)
assert.deepStrictEqual(moveTo(1)(0)(['a']), O.none)
```

Added in v0.7.0

## none

Check if a predicate does not hold for any array member.

import { none } from 'fp-ts-std/Array';
import { Predicate } from 'fp-ts/function';

const isFive: Predicate<number> = n => n === 5;
const noneAreFive = none(isFive);

assert.strictEqual(noneAreFive([4, 4, 4]), true);
assert.strictEqual(noneAreFive([4, 5, 4]), false);

**Signature**

```ts
export declare const none: <A>(f: Predicate<A>) => Predicate<A[]>
```

Added in v0.7.0

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

## product

Multiplies together all the numbers in the input array.

**Signature**

```ts
export declare const product: (xs: number[]) => number
```

**Example**

```ts
import { product } from 'fp-ts-std/Array'

assert.strictEqual(product([]), 1)
assert.strictEqual(product([5]), 5)
assert.strictEqual(product([4, 2, 3]), 24)
```

Added in v0.6.0

## reject

Filters out items in the array for which the predicate holds. This can be
thought of as the inverse of ordinary array filtering.

**Signature**

```ts
export declare const reject: <A>(f: Predicate<A>) => Endomorphism<A[]>
```

**Example**

```ts
import { reject } from 'fp-ts-std/Array'
import { Predicate } from 'fp-ts/function'

const isEven: Predicate<number> = (n) => n % 2 === 0

assert.deepStrictEqual(reject(isEven)([1, 2, 3, 4]), [1, 3])
```

Added in v0.7.0

## slice

Returns the elements of the array between the start index (inclusive) and the
end index (exclusive).

This is merely a functional wrapper around `Array.prototype.slice`.

**Signature**

```ts
export declare const slice: (start: number) => (end: number) => <A>(xs: A[]) => A[]
```

**Example**

```ts
import { slice } from 'fp-ts-std/Array'

const xs = ['a', 'b', 'c', 'd']

assert.deepStrictEqual(slice(1)(3)(xs), ['b', 'c'])
assert.deepStrictEqual(slice(1)(Infinity)(xs), ['b', 'c', 'd'])
assert.deepStrictEqual(slice(0)(-1)(xs), ['a', 'b', 'c'])
assert.deepStrictEqual(slice(-3)(-1)(xs), ['b', 'c'])
```

Added in v0.7.0

## startsWith

Check if an array starts with the specified subarray.

**Signature**

```ts
export declare const startsWith: <A>(eq: Eq<A>) => (start: A[]) => Predicate<A[]>
```

**Example**

```ts
import { startsWith } from 'fp-ts-std/Array'
import { eqString } from 'fp-ts/Eq'

const startsXyz = startsWith(eqString)(['x', 'y', 'z'])

assert.strictEqual(startsXyz(['x', 'y', 'z', 'a']), true)
assert.strictEqual(startsXyz(['a', 'x', 'y', 'z']), false)
```

Added in v0.7.0

## sum

Adds together all the numbers in the input array.

**Signature**

```ts
export declare const sum: (xs: number[]) => number
```

**Example**

```ts
import { sum } from 'fp-ts-std/Array'

assert.strictEqual(sum([]), 0)
assert.strictEqual(sum([25, 3, 10]), 38)
```

Added in v0.6.0

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

## without

Returns a new array without the values present in the first input array.

**Signature**

```ts
export declare const without: <A>(eq: Eq<A>) => (xs: A[]) => Endomorphism<A[]>
```

**Example**

```ts
import { without } from 'fp-ts-std/Array'
import { eqNumber } from 'fp-ts/Eq'

const withoutFourOrFive = without(eqNumber)([4, 5])

assert.deepStrictEqual(withoutFourOrFive([3, 4]), [3])
assert.deepStrictEqual(withoutFourOrFive([4, 5]), [])
assert.deepStrictEqual(withoutFourOrFive([4, 5, 6]), [6])
assert.deepStrictEqual(withoutFourOrFive([3, 4, 5, 6]), [3, 6])
assert.deepStrictEqual(withoutFourOrFive([4, 3, 4, 5, 6, 5]), [3, 6])
```

Added in v0.6.0
