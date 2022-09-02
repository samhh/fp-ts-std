---
title: ReadonlyArray.ts
nav_order: 25
parent: Modules
---

## ReadonlyArray overview

Various functions to aid in working with readonly arrays.

Added in v0.10.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [aperture](#aperture)
  - [cartesian](#cartesian)
  - [countBy](#countby)
  - [dropAt](#dropat)
  - [dropRepeats](#droprepeats)
  - [dropRightWhile](#droprightwhile)
  - [elemV](#elemv)
  - [endsWith](#endswith)
  - [extractAt](#extractat)
  - [filterA](#filtera)
  - [fromIterable](#fromiterable)
  - [getDisorderedEq](#getdisorderedeq)
  - [insertMany](#insertmany)
  - [join](#join)
  - [maximum](#maximum)
  - [mean](#mean)
  - [median](#median)
  - [minimum](#minimum)
  - [moveFrom](#movefrom)
  - [moveTo](#moveto)
  - [none](#none)
  - [pluckFirst](#pluckfirst)
  - [product](#product)
  - [reduceRightWhile](#reducerightwhile)
  - [reduceWhile](#reducewhile)
  - [reject](#reject)
  - [slice](#slice)
  - [startsWith](#startswith)
  - [sum](#sum)
  - [symmetricDifference](#symmetricdifference)
  - [takeRightWhile](#takerightwhile)
  - [transpose](#transpose)
  - [upsert](#upsert)
  - [without](#without)
  - [zipAll](#zipall)

---

# utils

## aperture

Returns an array of tuples of the specified length occupied by consecutive
elements.

If `n` is not a positive number, an empty array is returned.

If `n` is greater than the length of the array, an empty array is returned.

**Signature**

```ts
export declare const aperture: (n: number) => <A>(xs: readonly A[]) => readonly (readonly A[])[]
```

```hs
aperture :: number -> Array a -> Array (Array a)
```

**Example**

```ts
import { aperture } from 'fp-ts-std/ReadonlyArray'

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

Added in v0.10.0

## cartesian

Returns the {@link https://en.wikipedia.org/wiki/Cartesian_product Cartesian product}
of two arrays. In other words, returns an array containing tuples of every
possible ordered combination of the two input arrays.

**Signature**

```ts
export declare const cartesian: <A>(xs: readonly A[]) => <B>(ys: readonly B[]) => readonly [A, B][]
```

```hs
cartesian :: Array a -> Array b -> Array [a, b]
```

**Example**

```ts
import { cartesian } from 'fp-ts-std/ReadonlyArray'

assert.deepStrictEqual(cartesian([1, 2])(['a', 'b', 'c']), [
  [1, 'a'],
  [1, 'b'],
  [1, 'c'],
  [2, 'a'],
  [2, 'b'],
  [2, 'c'],
])
```

Added in v0.10.0

## countBy

Map each item of an array to a key, and count how many map to each key.

**Signature**

```ts
export declare const countBy: <A>(f: (x: A) => string) => (xs: readonly A[]) => Record<string, number>
```

```hs
countBy :: (a -> string) -> Array a -> Record string number
```

**Example**

```ts
import { countBy } from 'fp-ts-std/ReadonlyArray'
import * as S from 'fp-ts/string'

const f = countBy(S.toLowerCase)
const xs = ['A', 'b', 'C', 'a', 'e', 'A']

assert.deepStrictEqual(f(xs), { a: 3, b: 1, c: 1, e: 1 })
```

Added in v0.10.0

## dropAt

Drop a number of elements from the specified index an array, returning a
new array.

If `i` is out of bounds, `None` will be returned.

If `i` is a float, it will be rounded down to the nearest integer.

If `n` is larger than the available number of elements from the provided
index, only the elements prior to said index will be returned.

If `n` is not a positive number, the array will be returned whole.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const dropAt: (i: number) => (n: number) => <A>(xs: readonly A[]) => Option<readonly A[]>
```

```hs
dropAt :: number -> number -> Array a -> Option (Array a)
```

**Example**

```ts
import { dropAt } from 'fp-ts-std/ReadonlyArray'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(dropAt(2)(0)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b', 'c', 'd', 'e', 'f', 'g']))
assert.deepStrictEqual(dropAt(2)(3)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b', 'f', 'g']))
assert.deepStrictEqual(dropAt(2)(Infinity)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b']))
```

Added in v0.10.0

## dropRepeats

Filter a list, removing any elements that repeat that directly precede them.

**Signature**

```ts
export declare const dropRepeats: <A>(eq: Eq<A>) => Endomorphism<readonly A[]>
```

```hs
dropRepeats :: Eq a -> Endomorphism (Array a)
```

**Example**

```ts
import { dropRepeats } from 'fp-ts-std/ReadonlyArray'
import { eqNumber } from 'fp-ts/Eq'

assert.deepStrictEqual(dropRepeats(eqNumber)([1, 2, 2, 3, 2, 4, 4]), [1, 2, 3, 2, 4])
```

Added in v0.10.0

## dropRightWhile

Remove the longest initial subarray from the end of the input array for
which all elements satisfy the specified predicate, creating a new array.

**Signature**

```ts
export declare const dropRightWhile: <A>(f: Predicate<A>) => <B extends A>(xs: readonly B[]) => readonly B[]
```

```hs
dropRightWhile :: b extends a => Predicate a -> Array b -> Array b
```

**Example**

```ts
import { dropRightWhile } from 'fp-ts-std/ReadonlyArray'
import { Predicate } from 'fp-ts/Predicate'

const isEven: Predicate<number> = (n) => n % 2 === 0
const dropRightEvens = dropRightWhile(isEven)

assert.deepStrictEqual(dropRightEvens([6, 7, 3, 4, 2]), [6, 7, 3])
```

Added in v0.10.0

## elemV

Like `fp-ts/ReadonlyArray::elem` but flipped, which the "V" suffix denotes.

**Signature**

```ts
export declare const elemV: <A>(eq: Eq<A>) => (xs: readonly A[]) => Predicate<A>
```

```hs
elemV :: Eq a -> Array a -> Predicate a
```

**Example**

```ts
import { elemV } from 'fp-ts-std/ReadonlyArray'
import { eqString } from 'fp-ts/Eq'

const isLowerVowel = elemV(eqString)(['a', 'e', 'i', 'o', 'u'])

assert.strictEqual(isLowerVowel('a'), true)
assert.strictEqual(isLowerVowel('b'), false)
```

Added in v0.10.0

## endsWith

Check if an array ends with the specified subarray.

**Signature**

```ts
export declare const endsWith: <A>(eq: Eq<A>) => (end: readonly A[]) => Predicate<readonly A[]>
```

```hs
endsWith :: Eq a -> Array a -> Predicate (Array a)
```

**Example**

```ts
import { endsWith } from 'fp-ts-std/ReadonlyArray'
import { eqString } from 'fp-ts/Eq'

const endsXyz = endsWith(eqString)(['x', 'y', 'z'])

assert.strictEqual(endsXyz(['a', 'x', 'y', 'z']), true)
assert.strictEqual(endsXyz(['a', 'x', 'b', 'z']), false)
```

Added in v0.10.0

## extractAt

Remove the element at the specified index, returning both said element and
the remaining array. Returns `None` if the index is out of bounds.

**Signature**

```ts
export declare const extractAt: (i: number) => <A>(xs: readonly A[]) => Option<[A, readonly A[]]>
```

```hs
extractAt :: number -> Array a -> Option [a, (Array a)]
```

**Example**

```ts
import { extractAt } from 'fp-ts-std/ReadonlyArray'
import * as O from 'fp-ts/Option'

const f = extractAt(1)
assert.deepStrictEqual(f(['x']), O.none)
assert.deepStrictEqual(f(['x', 'y']), O.some(['y', ['x']]))
assert.deepStrictEqual(f(['x', 'y', 'z']), O.some(['y', ['x', 'z']]))
```

Added in v0.12.0

## filterA

Filter an array based upon a predicate whose boolean is returned in an
applicative context. This can be helpful if your predicate is asynchronous
and therefore `Task`-based, for example.

**Signature**

```ts
export declare function filterA<F extends URIS4>(
  F: Applicative4<F>
): <S, R, E, A>(
  p: (x: A) => Kind4<F, S, R, E, boolean>
) => (xs: ReadonlyArray<A>) => Kind4<F, S, R, E, ReadonlyArray<A>>
export declare function filterA<F extends URIS3>(
  F: Applicative3<F>
): <R, E, A>(p: (x: A) => Kind3<F, R, E, boolean>) => (xs: ReadonlyArray<A>) => Kind3<F, R, E, ReadonlyArray<A>>
export declare function filterA<F extends URIS2>(
  F: Applicative2<F>
): <E, A>(p: (x: A) => Kind2<F, E, boolean>) => (xs: ReadonlyArray<A>) => Kind2<F, E, ReadonlyArray<A>>
export declare function filterA<F extends URIS2, E>(
  F: Applicative2C<F, E>
): <A>(p: (x: A) => Kind2<F, E, boolean>) => (xs: ReadonlyArray<A>) => Kind2<F, E, ReadonlyArray<A>>
export declare function filterA<F extends URIS>(
  F: Applicative1<F>
): <A>(p: (x: A) => Kind<F, boolean>) => (xs: ReadonlyArray<A>) => Kind<F, ReadonlyArray<A>>
export declare function filterA<F>(
  F: Applicative<F>
): <A>(p: (x: A) => HKT<F, boolean>) => (xs: ReadonlyArray<A>) => HKT<F, ReadonlyArray<A>>
```

```hs
filterA :: f extends URIS4 => Applicative4 f -> (a -> Kind4 f s r e boolean) -> ReadonlyArray a -> Kind4 f s r e (ReadonlyArray a)
filterA :: f extends URIS3 => ((Applicative3 f) -> (a -> Kind3 f r e boolean) -> ReadonlyArray a -> Kind3 f r e (ReadonlyArray a))
filterA :: f extends URIS2 => ((Applicative2 f) -> (a -> Kind2 f e boolean) -> ReadonlyArray a -> Kind2 f e (ReadonlyArray a))
filterA :: f extends URIS2 => ((Applicative2C f e) -> (a -> Kind2 f e boolean) -> ReadonlyArray a -> Kind2 f e (ReadonlyArray a))
filterA :: f extends URIS => ((Applicative1 f) -> (a -> Kind f boolean) -> ReadonlyArray a -> Kind f (ReadonlyArray a))
filterA :: ((Applicative f) -> (a -> HKT f boolean) -> ReadonlyArray a -> HKT f (ReadonlyArray a))
```

**Example**

```ts
import * as T from 'fp-ts/Task'
import { Task } from 'fp-ts/Task'
import { filterA } from 'fp-ts-std/ReadonlyArray'

const asyncIsEven = (n: number): Task<boolean> => T.of(n % 2 === 0)

filterA(T.ApplicativePar)(asyncIsEven)([1, 2, 3, 4, 5])().then((xs) => {
  assert.deepStrictEqual(xs, [2, 4])
})
```

Added in v0.12.0

## fromIterable

Convert an `Iterable` to a `ReadonlyArray`.

**Signature**

```ts
export declare const fromIterable: <A>(xs: Iterable<A>) => readonly A[]
```

```hs
fromIterable :: Iterable a -> Array a
```

**Example**

```ts
import { fromIterable } from 'fp-ts-std/ReadonlyArray'

assert.deepStrictEqual(fromIterable('hello'), ['h', 'e', 'l', 'l', 'o'])
```

Added in v0.14.0

## getDisorderedEq

Like `fp-ts/Array::getEq`, but items are not required to be in the same
order to determine equivalence. This function is therefore less efficient,
and `getEq` should be preferred on ordered data.

**Signature**

```ts
export declare const getDisorderedEq: <A>(ordA: Ord<A>) => Eq<readonly A[]>
```

```hs
getDisorderedEq :: Ord a -> Eq (Array a)
```

**Example**

```ts
import { getEq } from 'fp-ts/Array'
import { getDisorderedEq } from 'fp-ts-std/ReadonlyArray'
import { ordNumber } from 'fp-ts/Ord'

const f = getEq(ordNumber)
const g = getDisorderedEq(ordNumber)

assert.strictEqual(f.equals([1, 2, 3], [1, 3, 2]), false)
assert.strictEqual(g.equals([1, 2, 3], [1, 3, 2]), true)
```

Added in v0.10.0

## insertMany

Insert all the elements of an array into another array at the specified
index. Returns `None` if the index is out of bounds.

The array of elements to insert must be non-empty.

**Signature**

```ts
export declare const insertMany: (
  i: number
) => <A>(xs: ReadonlyNonEmptyArray<A>) => (ys: readonly A[]) => Option<ReadonlyNonEmptyArray<A>>
```

```hs
insertMany :: number -> ReadonlyNonEmptyArray a -> Array a -> Option (ReadonlyNonEmptyArray a)
```

**Example**

```ts
import { insertMany } from 'fp-ts-std/ReadonlyArray'
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
export declare const join: (x: string) => (ys: ReadonlyArray<string>) => string
```

```hs
join :: string -> ReadonlyArray string -> string
```

**Example**

```ts
import { join } from 'fp-ts-std/ReadonlyArray'

const commaSepd = join(',')

assert.strictEqual(commaSepd([]), '')
assert.strictEqual(commaSepd(['a']), 'a')
assert.strictEqual(commaSepd(['a', 'b', 'c']), 'a,b,c')
```

Added in v0.10.0

## maximum

Obtain the maximum value from a non-empty array.

**Signature**

```ts
export declare const maximum: <A>(ord: Ord<A>) => (xs: ReadonlyNonEmptyArray<A>) => A
```

```hs
maximum :: Ord a -> ReadonlyNonEmptyArray a -> a
```

**Example**

```ts
import { maximum } from 'fp-ts-std/ReadonlyArray'
import { ordNumber } from 'fp-ts/Ord'

assert.strictEqual(maximum(ordNumber)([2, 3, 1, 5, 4]), 5)
```

Added in v0.10.0

## mean

Calculate the mean of an array of numbers.

**Signature**

```ts
export declare const mean: (xs: ReadonlyNonEmptyArray<number>) => number
```

```hs
mean :: ReadonlyNonEmptyArray number -> number
```

**Example**

```ts
import { mean } from 'fp-ts-std/ReadonlyArray'

assert.deepStrictEqual(mean([2, 7, 9]), 6)
```

Added in v0.10.0

## median

Calculate the median of an array of numbers.

**Signature**

```ts
export declare const median: (xs: ReadonlyNonEmptyArray<number>) => number
```

```hs
median :: ReadonlyNonEmptyArray number -> number
```

**Example**

```ts
import { median } from 'fp-ts-std/ReadonlyArray'

assert.deepStrictEqual(median([2, 9, 7]), 7)
assert.deepStrictEqual(median([7, 2, 10, 9]), 8)
```

Added in v0.10.0

## minimum

Obtain the minimum value from a non-empty array.

**Signature**

```ts
export declare const minimum: <A>(ord: Ord<A>) => (xs: ReadonlyNonEmptyArray<A>) => A
```

```hs
minimum :: Ord a -> ReadonlyNonEmptyArray a -> a
```

**Example**

```ts
import { minimum } from 'fp-ts-std/ReadonlyArray'
import { ordNumber } from 'fp-ts/Ord'

assert.strictEqual(minimum(ordNumber)([2, 3, 1, 5, 4]), 1)
```

Added in v0.10.0

## moveFrom

Move an item at index `from` to index `to`. See also `moveTo`.

If either index is out of bounds, `None` is returned.

If both indices are the same, the array is returned unchanged.

**Signature**

```ts
export declare const moveFrom: (from: number) => (to: number) => <A>(xs: readonly A[]) => Option<readonly A[]>
```

```hs
moveFrom :: number -> number -> Array a -> Option (Array a)
```

**Example**

```ts
import { moveFrom } from 'fp-ts-std/ReadonlyArray'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(moveFrom(0)(1)(['a', 'b', 'c']), O.some(['b', 'a', 'c']))
assert.deepStrictEqual(moveFrom(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']))
assert.deepStrictEqual(moveFrom(0)(0)([]), O.none)
assert.deepStrictEqual(moveFrom(0)(1)(['a']), O.none)
assert.deepStrictEqual(moveFrom(1)(0)(['a']), O.none)
```

Added in v0.10.0

## moveTo

Move an item at index `from` to index `to`. See also `moveFrom`.

If either index is out of bounds, `None` is returned.

If both indices are the same, the array is returned unchanged.

**Signature**

```ts
export declare const moveTo: (x: number) => (y: number) => <A>(xs: readonly A[]) => Option<readonly A[]>
```

```hs
moveTo :: number -> number -> Array a -> Option (Array a)
```

**Example**

```ts
import { moveTo } from 'fp-ts-std/ReadonlyArray'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(moveTo(1)(0)(['a', 'b', 'c']), O.some(['b', 'a', 'c']))
assert.deepStrictEqual(moveTo(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']))
assert.deepStrictEqual(moveTo(0)(0)([]), O.none)
assert.deepStrictEqual(moveTo(0)(1)(['a']), O.none)
assert.deepStrictEqual(moveTo(1)(0)(['a']), O.none)
```

Added in v0.10.0

## none

Check if a predicate does not hold for any array member.

**Signature**

```ts
export declare const none: <A>(f: Predicate<A>) => Predicate<readonly A[]>
```

```hs
none :: Predicate a -> Predicate (Array a)
```

**Example**

```ts
import { none } from 'fp-ts-std/ReadonlyArray'
import { Predicate } from 'fp-ts/Predicate'

const isFive: Predicate<number> = (n) => n === 5
const noneAreFive = none(isFive)

assert.strictEqual(noneAreFive([4, 4, 4]), true)
assert.strictEqual(noneAreFive([4, 5, 4]), false)
```

Added in v0.10.0

## pluckFirst

Pluck the first item out of an array matching a predicate. Any further
matches will be left untouched.

This can be thought of as analagous to `fp-ts/Array::findFirst` where
the remaining items, sans the match (if any), are returned as well.

**Signature**

```ts
export declare const pluckFirst: <A>(p: Predicate<A>) => (xs: readonly A[]) => [Option<A>, readonly A[]]
```

```hs
pluckFirst :: Predicate a -> Array a -> [Option a, Array a]
```

**Example**

```ts
import { pluckFirst } from 'fp-ts-std/ReadonlyArray'
import * as O from 'fp-ts/Option'
import { Predicate } from 'fp-ts/Predicate'

const isOverFive: Predicate<number> = (n) => n > 5
const pluckFirstOverFive = pluckFirst(isOverFive)

assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5]), [O.none, [1, 3, 5]])
assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5, 7, 9]), [O.some(7), [1, 3, 5, 9]])
```

Added in v0.10.0

## product

Multiplies together all the numbers in the input array.

**Signature**

```ts
export declare const product: (xs: ReadonlyArray<number>) => number
```

```hs
product :: ReadonlyArray number -> number
```

**Example**

```ts
import { product } from 'fp-ts-std/ReadonlyArray'

assert.strictEqual(product([]), 1)
assert.strictEqual(product([5]), 5)
assert.strictEqual(product([4, 2, 3]), 24)
```

Added in v0.10.0

## reduceRightWhile

Like ordinary array reduction, however this also takes a predicate that is
evaluated before each step. If the predicate doesn't hold, the reduction
short-circuits and returns the current accumulator value.

**Signature**

```ts
export declare const reduceRightWhile: <A>(
  p: Predicate<A>
) => <B>(f: (x: A) => (y: B) => B) => (x: B) => (ys: readonly A[]) => B
```

```hs
reduceRightWhile :: Predicate a -> (a -> b -> b) -> b -> Array a -> b
```

**Example**

```ts
import { reduceRightWhile } from 'fp-ts-std/ReadonlyArray'
import { add } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/Predicate'

const isEven: Predicate<number> = (n) => n % 2 === 0
const reduceRightUntilOdd = reduceRightWhile(isEven)

assert.strictEqual(reduceRightUntilOdd(add)(0)([2, 4, 7, 8, 10]), 18)
```

Added in v0.10.0

## reduceWhile

Like ordinary array reduction, however this also takes a predicate that is
evaluated before each step. If the predicate doesn't hold, the reduction
short-circuits and returns the current accumulator value.

**Signature**

```ts
export declare const reduceWhile: <A>(
  p: Predicate<A>
) => <B>(f: (x: A) => (y: B) => B) => (x: B) => (ys: readonly A[]) => B
```

```hs
reduceWhile :: Predicate a -> (a -> b -> b) -> b -> Array a -> b
```

**Example**

```ts
import { reduceWhile } from 'fp-ts-std/ReadonlyArray'
import { add } from 'fp-ts-std/Number'
import { Predicate } from 'fp-ts/Predicate'

const isEven: Predicate<number> = (n) => n % 2 === 0
const reduceUntilOdd = reduceWhile(isEven)

assert.strictEqual(reduceUntilOdd(add)(0)([2, 4, 6, 9, 10]), 12)
```

Added in v0.10.0

## reject

Filters out items in the array for which the predicate holds. This can be
thought of as the inverse of ordinary array filtering.

**Signature**

```ts
export declare const reject: <A>(f: Predicate<A>) => <B extends A>(xs: readonly B[]) => readonly B[]
```

```hs
reject :: b extends a => Predicate a -> Array b -> Array b
```

**Example**

```ts
import { reject } from 'fp-ts-std/ReadonlyArray'
import { Predicate } from 'fp-ts/Predicate'

const isEven: Predicate<number> = (n) => n % 2 === 0

assert.deepStrictEqual(reject(isEven)([1, 2, 3, 4]), [1, 3])
```

Added in v0.10.0

## slice

Returns the elements of the array between the start index (inclusive) and the
end index (exclusive).

This is merely a functional wrapper around `Array.prototype.slice`.

**Signature**

```ts
export declare const slice: (start: number) => (end: number) => <A>(xs: readonly A[]) => readonly A[]
```

```hs
slice :: number -> number -> Array a -> Array a
```

**Example**

```ts
import { slice } from 'fp-ts-std/ReadonlyArray'

const xs = ['a', 'b', 'c', 'd']

assert.deepStrictEqual(slice(1)(3)(xs), ['b', 'c'])
assert.deepStrictEqual(slice(1)(Infinity)(xs), ['b', 'c', 'd'])
assert.deepStrictEqual(slice(0)(-1)(xs), ['a', 'b', 'c'])
assert.deepStrictEqual(slice(-3)(-1)(xs), ['b', 'c'])
```

Added in v0.10.0

## startsWith

Check if an array starts with the specified subarray.

**Signature**

```ts
export declare const startsWith: <A>(eq: Eq<A>) => (start: readonly A[]) => Predicate<readonly A[]>
```

```hs
startsWith :: Eq a -> Array a -> Predicate (Array a)
```

**Example**

```ts
import { startsWith } from 'fp-ts-std/ReadonlyArray'
import { eqString } from 'fp-ts/Eq'

const startsXyz = startsWith(eqString)(['x', 'y', 'z'])

assert.strictEqual(startsXyz(['x', 'y', 'z', 'a']), true)
assert.strictEqual(startsXyz(['a', 'x', 'y', 'z']), false)
```

Added in v0.10.0

## sum

Adds together all the numbers in the input array.

**Signature**

```ts
export declare const sum: (xs: ReadonlyArray<number>) => number
```

```hs
sum :: ReadonlyArray number -> number
```

**Example**

```ts
import { sum } from 'fp-ts-std/ReadonlyArray'

assert.strictEqual(sum([]), 0)
assert.strictEqual(sum([25, 3, 10]), 38)
```

Added in v0.10.0

## symmetricDifference

Creates an array of all values which are present in one of the two input
arrays, but not both. The order is determined by the input arrays and
duplicate values present only in one input array are maintained.

**Signature**

```ts
export declare const symmetricDifference: <A>(eq: Eq<A>) => (xs: readonly A[]) => Endomorphism<readonly A[]>
```

```hs
symmetricDifference :: Eq a -> Array a -> Endomorphism (Array a)
```

**Example**

```ts
import { symmetricDifference } from 'fp-ts-std/ReadonlyArray'
import { eqNumber } from 'fp-ts/Eq'

assert.deepStrictEqual(symmetricDifference(eqNumber)([1, 2, 3, 4])([3, 4, 5, 6]), [1, 2, 5, 6])
assert.deepStrictEqual(symmetricDifference(eqNumber)([1, 7, 7, 4, 3])([3, 4, 9, 6]), [1, 7, 7, 9, 6])
```

Added in v0.10.0

## takeRightWhile

Calculate the longest initial subarray from the end of the input array for
which all elements satisfy the specified predicate, creating a new array.

**Signature**

```ts
export declare const takeRightWhile: <A>(f: Predicate<A>) => <B extends A>(xs: readonly B[]) => readonly B[]
```

```hs
takeRightWhile :: b extends a => Predicate a -> Array b -> Array b
```

**Example**

```ts
import { takeRightWhile } from 'fp-ts-std/ReadonlyArray'
import { Predicate } from 'fp-ts/Predicate'

const isEven: Predicate<number> = (n) => n % 2 === 0
const takeRightEvens = takeRightWhile(isEven)

assert.deepStrictEqual(takeRightEvens([6, 7, 3, 4, 2]), [4, 2])
```

Added in v0.10.0

## transpose

Tranposes the rows and columns of a 2D list. If some of the rows are shorter
than the following rows, their elements are skipped.

**Signature**

```ts
export declare const transpose: <A>(xs: readonly (readonly A[])[]) => readonly (readonly A[])[]
```

```hs
transpose :: Array (Array a) -> Array (Array a)
```

**Example**

```ts
import { transpose } from 'fp-ts-std/ReadonlyArray'

assert.deepStrictEqual(
  transpose([
    [1, 2, 3],
    [4, 5, 6],
  ]),
  [
    [1, 4],
    [2, 5],
    [3, 6],
  ]
)
assert.deepStrictEqual(
  transpose([
    [1, 4],
    [2, 5],
    [3, 6],
  ]),
  [
    [1, 2, 3],
    [4, 5, 6],
  ]
)
assert.deepStrictEqual(transpose([[10, 11], [20], [], [30, 31, 32]]), [[10, 20, 30], [11, 31], [32]])
```

Added in v0.10.0

## upsert

Update an item in an array or, if it's not present yet, insert it.

If the item exists more than once (as determined by the supplied `Eq`
instance), only the first to be found will be updated. The order in which
the array is checked is unspecified.

**Signature**

```ts
export declare const upsert: <A>(eqA: Eq<A>) => (x: A) => (ys: readonly A[]) => ReadonlyNonEmptyArray<A>
```

```hs
upsert :: Eq a -> a -> Array a -> ReadonlyNonEmptyArray a
```

**Example**

```ts
import { upsert } from 'fp-ts-std/ReadonlyArray'
import { eqString, contramap } from 'fp-ts/Eq'

type Account = {
  id: string
  name: string
}

const eqAccount = contramap<string, Account>((acc) => acc.id)(eqString)

const accounts: ReadonlyArray<Account> = [
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

Added in v0.10.0

## without

Returns a new array without the values present in the first input array.

**Signature**

```ts
export declare const without: <A>(eq: Eq<A>) => (xs: readonly A[]) => Endomorphism<readonly A[]>
```

```hs
without :: Eq a -> Array a -> Endomorphism (Array a)
```

**Example**

```ts
import { without } from 'fp-ts-std/ReadonlyArray'
import { eqNumber } from 'fp-ts/Eq'

const withoutFourOrFive = without(eqNumber)([4, 5])

assert.deepStrictEqual(withoutFourOrFive([3, 4]), [3])
assert.deepStrictEqual(withoutFourOrFive([4, 5]), [])
assert.deepStrictEqual(withoutFourOrFive([4, 5, 6]), [6])
assert.deepStrictEqual(withoutFourOrFive([3, 4, 5, 6]), [3, 6])
assert.deepStrictEqual(withoutFourOrFive([4, 3, 4, 5, 6, 5]), [3, 6])
```

Added in v0.10.0

## zipAll

Greedy zip, preserving all items and expressing the possibility of unequal
input sizes via the `These` type.

**Signature**

```ts
export declare const zipAll: <A>(xs: readonly A[]) => <B>(ys: readonly B[]) => readonly These<B, A>[]
```

```hs
zipAll :: Array a -> Array b -> Array (These b a)
```

**Example**

```ts
import { zipAll } from 'fp-ts-std/ReadonlyArray'
import * as T from 'fp-ts/These'

assert.deepStrictEqual(zipAll([3, 4, 5, 6])([1, 2]), [T.both(1, 3), T.both(2, 4), T.right(5), T.right(6)])
```

Added in v0.11.0
