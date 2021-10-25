/**
 * Various functions to aid in working with readonly arrays.
 *
 * @since 0.10.0
 */

import { constant, pipe, flow } from "fp-ts/function"
import { Predicate, not } from "fp-ts/Predicate"
import { Endomorphism } from "fp-ts/Endomorphism"
import { Eq } from "fp-ts/Eq"
import { Ord } from "fp-ts/Ord"
import { match as orderingMatch } from "fp-ts/Ordering"
import { Ord as ordNumber, MonoidProduct, MonoidSum } from "fp-ts/number"
import { ReadonlyNonEmptyArray } from "fp-ts/ReadonlyNonEmptyArray"
import * as NEA from "fp-ts/ReadonlyNonEmptyArray"
import { copy } from "fp-ts/Array"
import * as RA from "fp-ts/ReadonlyArray"
import * as R from "fp-ts/ReadonlyRecord"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import * as B from "fp-ts/boolean"
import { reduceM } from "fp-ts/Foldable"
import { concatAll } from "fp-ts/Monoid"
import { max, min } from "fp-ts/Semigroup"
import { flip, invoke } from "./Function"
import { These } from "fp-ts/These"
import * as T from "fp-ts/These"
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from "fp-ts/HKT"
import {
  Applicative,
  Applicative1,
  Applicative2,
  Applicative3,
  Applicative4,
  Applicative2C,
} from "fp-ts/Applicative"

/**
 * Like `fp-ts/Array::elem`, but flipped.
 *
 * @example
 * import { elemFlipped } from 'fp-ts-std/ReadonlyArray';
 * import { eqString } from 'fp-ts/Eq';
 *
 * const isLowerVowel = elemFlipped(eqString)(['a', 'e', 'i', 'o', 'u']);
 *
 * assert.strictEqual(isLowerVowel('a'), true);
 * assert.strictEqual(isLowerVowel('b'), false);
 *
 * @since 0.10.0
 */
export const elemFlipped =
  <A>(eq: Eq<A>) =>
  (xs: ReadonlyArray<A>): Predicate<A> =>
  y =>
    RA.elem(eq)(y)(xs)

/**
 * Check if a predicate does not hold for any array member.
 *
 * @example
 * import { none } from 'fp-ts-std/ReadonlyArray';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isFive: Predicate<number> = n => n === 5;
 * const noneAreFive = none(isFive);
 *
 * assert.strictEqual(noneAreFive([4, 4, 4]), true);
 * assert.strictEqual(noneAreFive([4, 5, 4]), false);
 *
 * @since 0.10.0
 */
export const none: <A>(f: Predicate<A>) => Predicate<ReadonlyArray<A>> = flow(
  not,
  RA.every,
)

/**
 * Join an array of strings together into a single string using the supplied
 * separator.
 *
 * @example
 * import { join } from 'fp-ts-std/ReadonlyArray';
 *
 * const commaSepd = join(',');
 *
 * assert.strictEqual(commaSepd([]), '');
 * assert.strictEqual(commaSepd(['a']), 'a');
 * assert.strictEqual(commaSepd(['a', 'b', 'c']), 'a,b,c');
 *
 * @since 0.10.0
 */
export const join = (x: string): ((ys: ReadonlyArray<string>) => string) =>
  invoke("join")([x])

/**
 * Like `fp-ts/Array::getEq`, but items are not required to be in the same
 * order to determine equivalence. This function is therefore less efficient,
 * and `getEq` should be preferred on ordered data.
 *
 * @example
 * import { getEq } from 'fp-ts/Array';
 * import { getDisorderedEq } from 'fp-ts-std/ReadonlyArray';
 * import { ordNumber } from 'fp-ts/Ord';
 *
 * const f = getEq(ordNumber);
 * const g = getDisorderedEq(ordNumber);
 *
 * assert.strictEqual(f.equals([1, 2, 3], [1, 3, 2]), false);
 * assert.strictEqual(g.equals([1, 2, 3], [1, 3, 2]), true);
 *
 * @since 0.10.0
 */
export const getDisorderedEq = <A>(ordA: Ord<A>): Eq<ReadonlyArray<A>> => ({
  equals: (xs: ReadonlyArray<A>, ys: ReadonlyArray<A>) => {
    const sort = RA.sort(ordA)

    return RA.getEq(ordA).equals(sort(xs), sort(ys))
  },
})

/**
 * Pluck the first item out of an array matching a predicate. Any further
 * matches will be left untouched.
 *
 * This can be thought of as analagous to `fp-ts/Array::findFirst` where
 * the remaining items, sans the match (if any), are returned as well.
 *
 * @example
 * import { pluckFirst } from 'fp-ts-std/ReadonlyArray';
 * import * as O from 'fp-ts/Option';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isOverFive: Predicate<number> = n => n > 5;
 * const pluckFirstOverFive = pluckFirst(isOverFive);
 *
 * assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5]), [O.none, [1, 3, 5]]);
 * assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5, 7, 9]), [O.some(7), [1, 3, 5, 9]]);
 *
 * @since 0.10.0
 */
export const pluckFirst =
  <A>(p: Predicate<A>) =>
  (xs: ReadonlyArray<A>): [Option<A>, ReadonlyArray<A>] =>
    pipe(
      RA.findIndex(p)(xs),
      O.fold(constant([O.none, xs]), i => [
        O.some(xs[i]),
        RA.unsafeDeleteAt(i, xs),
      ]),
    )

/**
 * Update an item in an array or, if it's not present yet, insert it.
 *
 * If the item exists more than once (as determined by the supplied `Eq`
 * instance), only the first to be found will be updated. The order in which
 * the array is checked is unspecified.
 *
 * @example
 * import { upsert } from 'fp-ts-std/ReadonlyArray';
 * import { eqString, contramap } from 'fp-ts/Eq';
 *
 * type Account = {
 *     id: string;
 *     name: string;
 * };
 *
 * const eqAccount = contramap<string, Account>(acc => acc.id)(eqString);
 *
 * const accounts: ReadonlyArray<Account> = [{
 *     id: 'a',
 *     name: 'an account',
 * }, {
 *     id: 'b',
 *     name: 'another account',
 * }];
 *
 * const created: Account = {
 *     id: 'c',
 *     name: 'yet another account',
 * };
 *
 * const updated: Account = {
 *     id: 'b',
 *     name: 'renamed account name',
 * };
 *
 * const upsertAccount = upsert(eqAccount);
 *
 * assert.deepStrictEqual(upsertAccount(created)(accounts), [accounts[0], accounts[1], created]);
 * assert.deepStrictEqual(upsertAccount(updated)(accounts), [accounts[0], updated]);
 *
 * @since 0.10.0
 */
export const upsert =
  <A>(eqA: Eq<A>) =>
  (x: A) =>
  (ys: ReadonlyArray<A>): ReadonlyNonEmptyArray<A> =>
    pipe(
      RA.findIndex<A>(y => eqA.equals(x, y))(ys),
      O.map(i => RA.unsafeUpdateAt(i, x, ys)),
      O.chain(NEA.fromReadonlyArray),
      O.getOrElse(() => RA.append(x)(ys)),
    )

/**
 * Insert all the elements of an array into another array at the specified
 * index. Returns `None` if the index is out of bounds.
 *
 * The array of elements to insert must be non-empty.
 *
 * @example
 * import { insertMany } from 'fp-ts-std/ReadonlyArray';
 * import * as O from 'fp-ts/Option';
 *
 * const f = insertMany(1)(['a', 'b']);
 * assert.deepStrictEqual(f([]), O.none);
 * assert.deepStrictEqual(f(['x']), O.some(['x', 'a', 'b']));
 * assert.deepStrictEqual(f(['x', 'y']), O.some(['x', 'a', 'b', 'y']));
 *
 * @since 0.5.0
 */
export const insertMany =
  (i: number) =>
  <A>(xs: ReadonlyNonEmptyArray<A>) =>
  (ys: ReadonlyArray<A>): Option<ReadonlyNonEmptyArray<A>> =>
    pipe(
      xs,
      RA.reverse,
      reduceM(O.Monad, RA.Foldable)(ys, (zs, x) => pipe(zs, RA.insertAt(i, x))),
      O.chain(NEA.fromReadonlyArray),
    )

/**
 * Filter a list, removing any elements that repeat that directly precede them.
 *
 * @example
 * import { dropRepeats } from 'fp-ts-std/ReadonlyArray';
 * import { eqNumber } from 'fp-ts/Eq'
 *
 * assert.deepStrictEqual(dropRepeats(eqNumber)([1, 2, 2, 3, 2, 4, 4]), [1, 2, 3, 2, 4]);
 *
 * @since 0.10.0
 */
export const dropRepeats: <A>(eq: Eq<A>) => Endomorphism<ReadonlyArray<A>> =
  eq => xs =>
    pipe(
      xs,
      RA.filterWithIndex((i, x) => i === 0 || !eq.equals(x, xs[i - 1])),
    )

/**
 * Check if an array starts with the specified subarray.
 *
 * @example
 * import { startsWith } from 'fp-ts-std/ReadonlyArray';
 * import { eqString } from 'fp-ts/Eq'
 *
 * const startsXyz = startsWith(eqString)(['x', 'y', 'z']);
 *
 * assert.strictEqual(startsXyz(['x', 'y', 'z', 'a']), true);
 * assert.strictEqual(startsXyz(['a', 'x', 'y', 'z']), false);
 *
 * @since 0.10.0
 */
export const startsWith =
  <A>(eq: Eq<A>) =>
  (start: ReadonlyArray<A>): Predicate<ReadonlyArray<A>> =>
    flow(RA.takeLeft(start.length), xs => RA.getEq(eq).equals(xs, start))

/**
 * Check if an array ends with the specified subarray.
 *
 * @example
 * import { endsWith } from 'fp-ts-std/ReadonlyArray';
 * import { eqString } from 'fp-ts/Eq'
 *
 * const endsXyz = endsWith(eqString)(['x', 'y', 'z']);
 *
 * assert.strictEqual(endsXyz(['a', 'x', 'y', 'z']), true);
 * assert.strictEqual(endsXyz(['a', 'x', 'b', 'z']), false);
 *
 * @since 0.10.0
 */
export const endsWith =
  <A>(eq: Eq<A>) =>
  (end: ReadonlyArray<A>): Predicate<ReadonlyArray<A>> =>
    flow(RA.takeRight(end.length), xs => RA.getEq(eq).equals(xs, end))

/**
 * Returns a new array without the values present in the first input array.
 *
 * @example
 * import { without } from 'fp-ts-std/ReadonlyArray';
 * import { eqNumber } from 'fp-ts/Eq';
 *
 * const withoutFourOrFive = without(eqNumber)([4, 5]);
 *
 * assert.deepStrictEqual(withoutFourOrFive([3, 4]), [3]);
 * assert.deepStrictEqual(withoutFourOrFive([4, 5]), []);
 * assert.deepStrictEqual(withoutFourOrFive([4, 5, 6]), [6]);
 * assert.deepStrictEqual(withoutFourOrFive([3, 4, 5, 6]), [3, 6]);
 * assert.deepStrictEqual(withoutFourOrFive([4, 3, 4, 5, 6, 5]), [3, 6]);
 *
 * @since 0.10.0
 */
export const without =
  <A>(eq: Eq<A>) =>
  (xs: ReadonlyArray<A>): Endomorphism<ReadonlyArray<A>> =>
    flow(RA.filter(y => !RA.elem(eq)(y)(xs)))

/**
 * Returns the {@link https://en.wikipedia.org/wiki/Cartesian_product Cartesian product}
 * of two arrays. In other words, returns an array containing tuples of every
 * possible ordered combination of the two input arrays.
 *
 * @example
 * import { cartesian } from 'fp-ts-std/ReadonlyArray';
 *
 * assert.deepStrictEqual(
 *     cartesian([1, 2])(['a', 'b', 'c']),
 *     [[1, 'a'], [1, 'b'], [1, 'c'], [2, 'a'], [2, 'b'], [2, 'c']],
 * );
 *
 * @since 0.10.0
 */
export const cartesian =
  <A>(xs: ReadonlyArray<A>) =>
  <B>(ys: ReadonlyArray<B>): ReadonlyArray<[A, B]> =>
    pipe(
      xs,
      RA.chain(x =>
        pipe(
          ys,
          RA.map(y => [x, y]),
        ),
      ),
    )

/**
 * Adds together all the numbers in the input array.
 *
 * @example
 * import { sum } from 'fp-ts-std/ReadonlyArray';
 *
 * assert.strictEqual(sum([]), 0);
 * assert.strictEqual(sum([25, 3, 10]), 38);
 *
 * @since 0.10.0
 */
export const sum: (xs: ReadonlyArray<number>) => number = concatAll(MonoidSum)

/**
 * Multiplies together all the numbers in the input array.
 *
 * @example
 * import { product } from 'fp-ts-std/ReadonlyArray';
 *
 * assert.strictEqual(product([]), 1);
 * assert.strictEqual(product([5]), 5);
 * assert.strictEqual(product([4, 2, 3]), 24);
 *
 * @since 0.10.0
 */
export const product: (xs: ReadonlyArray<number>) => number =
  concatAll(MonoidProduct)

/**
 * Calculate the mean of an array of numbers.
 *
 * @example
 * import { mean } from 'fp-ts-std/ReadonlyArray';
 *
 * assert.deepStrictEqual(mean([2, 7, 9]), 6);
 *
 * @since 0.10.0
 */
export const mean = (xs: ReadonlyNonEmptyArray<number>): number =>
  sum(xs) / xs.length

/**
 * Calculate the median of an array of numbers.
 *
 * @example
 * import { median } from 'fp-ts-std/ReadonlyArray';
 *
 * assert.deepStrictEqual(median([2, 9, 7]), 7);
 * assert.deepStrictEqual(median([7, 2, 10, 9]), 8);
 *
 * @since 0.10.0
 */
export const median: (xs: ReadonlyNonEmptyArray<number>) => number = flow(
  NEA.sort(ordNumber),
  xs => {
    const i = xs.length / 2
    return i % 1 === 0 ? (xs[i - 1] + xs[i]) / 2 : xs[Math.floor(i)]
  },
)

/**
 * Returns an array of tuples of the specified length occupied by consecutive
 * elements.
 *
 * If `n` is not a positive number, an empty array is returned.
 *
 * If `n` is greater than the length of the array, an empty array is returned.
 *
 * @example
 * import { aperture } from 'fp-ts-std/ReadonlyArray';
 *
 * assert.deepStrictEqual(aperture(1)([1, 2, 3, 4]), [[1], [2], [3], [4]]);
 * assert.deepStrictEqual(aperture(2)([1, 2, 3, 4]), [[1, 2], [2, 3], [3, 4]]);
 * assert.deepStrictEqual(aperture(3)([1, 2, 3, 4]), [[1, 2, 3], [2, 3, 4]]);
 * assert.deepStrictEqual(aperture(4)([1, 2, 3, 4]), [[1, 2, 3, 4]]);
 *
 * @since 0.10.0
 */
export const aperture =
  (n: number) =>
  <A>(xs: ReadonlyArray<A>): ReadonlyArray<ReadonlyArray<A>> => {
    const go =
      (i: number) =>
      (ys: ReadonlyArray<ReadonlyArray<A>>): ReadonlyArray<ReadonlyArray<A>> =>
        i + n > xs.length ? ys : go(i + 1)(RA.append(slice(i)(n + i)(xs))(ys))

    return n < 1 ? [] : go(0)([])
  }

/**
 * Returns the elements of the array between the start index (inclusive) and the
 * end index (exclusive).
 *
 * This is merely a functional wrapper around `Array.prototype.slice`.
 *
 * @example
 * import { slice } from 'fp-ts-std/ReadonlyArray';
 *
 * const xs = ['a', 'b', 'c', 'd'];
 *
 * assert.deepStrictEqual(slice(1)(3)(xs), ['b', 'c']);
 * assert.deepStrictEqual(slice(1)(Infinity)(xs), ['b', 'c', 'd']);
 * assert.deepStrictEqual(slice(0)(-1)(xs), ['a', 'b', 'c']);
 * assert.deepStrictEqual(slice(-3)(-1)(xs), ['b', 'c']);
 *
 * @since 0.10.0
 */
export const slice =
  (start: number) =>
  (end: number): (<A>(xs: ReadonlyArray<A>) => ReadonlyArray<A>) =>
    invoke("slice")([start, end])

/**
 * Filters out items in the array for which the predicate holds. This can be
 * thought of as the inverse of ordinary array filtering.
 *
 * @example
 * import { reject } from 'fp-ts-std/ReadonlyArray';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 *
 * assert.deepStrictEqual(reject(isEven)([1, 2, 3, 4]), [1, 3]);
 *
 * @since 0.10.0
 */
export const reject = <A>(f: Predicate<A>): Endomorphism<ReadonlyArray<A>> =>
  RA.filter(not(f))

/**
 * Move an item at index `from` to index `to`. See also `moveTo`.
 *
 * If either index is out of bounds, `None` is returned.
 *
 * If both indices are the same, the array is returned unchanged.
 *
 * @example
 * import { moveFrom } from 'fp-ts-std/ReadonlyArray';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(moveFrom(0)(1)(['a', 'b', 'c']), O.some(['b', 'a', 'c']));
 * assert.deepStrictEqual(moveFrom(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']));
 * assert.deepStrictEqual(moveFrom(0)(0)([]), O.none);
 * assert.deepStrictEqual(moveFrom(0)(1)(['a']), O.none);
 * assert.deepStrictEqual(moveFrom(1)(0)(['a']), O.none);
 *
 * @since 0.10.0
 */
export const moveFrom =
  (from: number) =>
  (to: number) =>
  <A>(xs: ReadonlyArray<A>): Option<ReadonlyArray<A>> =>
    from >= xs.length || to >= xs.length
      ? O.none
      : from === to
      ? O.some(xs)
      : pipe(
          xs,
          RA.lookup(from),
          O.chain(x =>
            pipe(RA.deleteAt(from)(xs), O.chain(RA.insertAt(to, x))),
          ),
        )

/**
 * Move an item at index `from` to index `to`. See also `moveFrom`.
 *
 * If either index is out of bounds, `None` is returned.
 *
 * If both indices are the same, the array is returned unchanged.
 *
 * @example
 * import { moveTo } from 'fp-ts-std/ReadonlyArray';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(moveTo(1)(0)(['a', 'b', 'c']), O.some(['b', 'a', 'c']));
 * assert.deepStrictEqual(moveTo(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']));
 * assert.deepStrictEqual(moveTo(0)(0)([]), O.none);
 * assert.deepStrictEqual(moveTo(0)(1)(['a']), O.none);
 * assert.deepStrictEqual(moveTo(1)(0)(['a']), O.none);
 *
 * @since 0.10.0
 */
export const moveTo = flip(moveFrom)

/**
 * Map each item of an array to a key, and count how many map to each key.
 *
 * @example
 * import { countBy } from 'fp-ts-std/ReadonlyArray';
 * import * as S from 'fp-ts/string';
 *
 * const f = countBy(S.toLowerCase);
 * const xs = ['A', 'b', 'C', 'a', 'e', 'A'];
 *
 * assert.deepStrictEqual(f(xs), { a: 3, b: 1, c: 1, e: 1 });
 *
 * @since 0.10.0
 */
export const countBy =
  <A>(f: (x: A) => string) =>
  (xs: ReadonlyArray<A>): Record<string, number> =>
    R.fromFoldableMap(MonoidSum, RA.Foldable)(xs, x => [f(x), 1])

/**
 * Remove the longest initial subarray from the end of the input array for
 * which all elements satisfy the specified predicate, creating a new array.
 *
 * @example
 * import { dropRightWhile } from 'fp-ts-std/ReadonlyArray';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const dropRightEvens = dropRightWhile(isEven);
 *
 * assert.deepStrictEqual(dropRightEvens([6, 7, 3, 4, 2]), [6, 7, 3]);
 *
 * @since 0.10.0
 */
export const dropRightWhile = <A>(
  f: Predicate<A>,
): Endomorphism<ReadonlyArray<A>> =>
  flow(RA.reverse, RA.dropLeftWhile(f), RA.reverse)

/**
 * Drop a number of elements from the specified index an array, returning a
 * new array.
 *
 * If `i` is out of bounds, `None` will be returned.
 *
 * If `i` is a float, it will be rounded down to the nearest integer.
 *
 * If `n` is larger than the available number of elements from the provided
 * index, only the elements prior to said index will be returned.
 *
 * If `n` is not a positive number, the array will be returned whole.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import { dropAt } from 'fp-ts-std/ReadonlyArray';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(dropAt(2)(0)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b', 'c', 'd', 'e', 'f', 'g']));
 * assert.deepStrictEqual(dropAt(2)(3)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b', 'f', 'g']));
 * assert.deepStrictEqual(dropAt(2)(Infinity)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b']));
 *
 * @since 0.10.0
 */

export const dropAt =
  (i: number) =>
  (n: number) =>
  <A>(xs: ReadonlyArray<A>): Option<ReadonlyArray<A>> =>
    pipe(
      RA.isOutOfBound(i, xs),
      B.fold(
        () =>
          pipe(
            copy(Array.from(xs)),
            ys => {
              // eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
              ys.splice(i, n)
              return ys
            },
            O.some,
          ),
        constant(O.none),
      ),
    )

/**
 * Tranposes the rows and columns of a 2D list. If some of the rows are shorter
 * than the following rows, their elements are skipped.
 *
 * @example
 * import { transpose } from 'fp-ts-std/ReadonlyArray';
 *
 * assert.deepStrictEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
 * assert.deepStrictEqual(transpose([[1, 4], [2, 5], [3, 6]]), [[1, 2, 3], [4, 5, 6]]);
 * assert.deepStrictEqual(transpose([[10, 11], [20], [], [30, 31,32]]), [[10, 20, 30], [11, 31], [32]]);
 *
 * @since 0.10.0
 */
export const transpose = <A>(
  xs: ReadonlyArray<ReadonlyArray<A>>,
): ReadonlyArray<ReadonlyArray<A>> => {
  /* eslint-disable functional/no-conditional-statement */
  if (RA.isEmpty(xs)) return []
  if (RA.isEmpty(xs[0])) return transpose(RA.dropLeft(1)(xs))
  /* eslint-enable functional/no-conditional-statement */

  const [[y, ...ys], ...yss] = xs
  const zs = [y, ...RA.filterMap(RA.head)(yss)]
  const zss = [ys, ...RA.map(RA.dropLeft(1))(yss)]
  return [zs, ...transpose(zss)]
}

/**
 * Calculate the longest initial subarray from the end of the input array for
 * which all elements satisfy the specified predicate, creating a new array.
 *
 * @example
 * import { takeRightWhile } from 'fp-ts-std/ReadonlyArray';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const takeRightEvens = takeRightWhile(isEven);
 *
 * assert.deepStrictEqual(takeRightEvens([6, 7, 3, 4, 2]), [4, 2]);
 *
 * @since 0.10.0
 */
export const takeRightWhile = <A>(
  f: Predicate<A>,
): Endomorphism<ReadonlyArray<A>> =>
  flow(RA.reverse, RA.takeLeftWhile(f), RA.reverse)

/**
 * Creates an array of all values which are present in one of the two input
 * arrays, but not both. The order is determined by the input arrays and
 * duplicate values present only in one input array are maintained.
 *
 * @example
 * import { symmetricDifference } from 'fp-ts-std/ReadonlyArray';
 * import { eqNumber } from 'fp-ts/Eq';
 *
 * assert.deepStrictEqual(symmetricDifference(eqNumber)([1, 2, 3, 4])([3, 4, 5, 6]), [1, 2, 5, 6]);
 * assert.deepStrictEqual(symmetricDifference(eqNumber)([1, 7, 7, 4, 3])([3, 4, 9, 6]), [1, 7, 7, 9, 6]);
 *
 * @since 0.10.0
 */
export const symmetricDifference =
  <A>(eq: Eq<A>) =>
  (xs: ReadonlyArray<A>): Endomorphism<ReadonlyArray<A>> =>
  ys =>
    RA.getMonoid<A>().concat(
      RA.difference(eq)(ys)(xs),
      RA.difference(eq)(xs)(ys),
    )

/**
 * Like ordinary array reduction, however this also takes a predicate that is
 * evaluated before each step. If the predicate doesn't hold, the reduction
 * short-circuits and returns the current accumulator value.
 *
 * @example
 * import { reduceWhile } from 'fp-ts-std/ReadonlyArray';
 * import { add } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const reduceUntilOdd = reduceWhile(isEven);
 *
 * assert.strictEqual(reduceUntilOdd(add)(0)([2, 4, 6, 9, 10]), 12);
 *
 * @since 0.10.0
 */
export const reduceWhile =
  <A>(p: Predicate<A>) =>
  <B>(f: (x: A) => (y: B) => B): ((x: B) => (ys: ReadonlyArray<A>) => B) => {
    const go =
      (acc: B) =>
      (ys: ReadonlyArray<A>): B =>
        pipe(
          NEA.fromReadonlyArray(ys),
          O.filter(flow(NEA.head, p)),
          O.fold(
            constant(acc),
            flow(NEA.unprepend, ([z, zs]) => go(f(z)(acc))(zs)),
          ),
        )

    return go
  }

/**
 * Like ordinary array reduction, however this also takes a predicate that is
 * evaluated before each step. If the predicate doesn't hold, the reduction
 * short-circuits and returns the current accumulator value.
 *
 * @example
 * import { reduceRightWhile } from 'fp-ts-std/ReadonlyArray';
 * import { add } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/Predicate';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const reduceRightUntilOdd = reduceRightWhile(isEven);
 *
 * assert.strictEqual(reduceRightUntilOdd(add)(0)([2, 4, 7, 8, 10]), 18);
 *
 * @since 0.10.0
 */
export const reduceRightWhile =
  <A>(p: Predicate<A>) =>
  <B>(f: (x: A) => (y: B) => B) =>
  (x: B): ((ys: ReadonlyArray<A>) => B) =>
    flow(RA.reverse, reduceWhile(p)(f)(x))

/**
 * Obtain the minimum value from a non-empty array.
 *
 * @example
 * import { minimum } from 'fp-ts-std/ReadonlyArray';
 * import { ordNumber } from 'fp-ts/Ord';
 *
 * assert.strictEqual(minimum(ordNumber)([2, 3, 1, 5, 4]), 1);
 *
 * @since 0.10.0
 */
export const minimum: <A>(ord: Ord<A>) => (xs: ReadonlyNonEmptyArray<A>) => A =
  flow(min, NEA.concatAll)

/**
 * Obtain the maximum value from a non-empty array.
 *
 * @example
 * import { maximum } from 'fp-ts-std/ReadonlyArray';
 * import { ordNumber } from 'fp-ts/Ord';
 *
 * assert.strictEqual(maximum(ordNumber)([2, 3, 1, 5, 4]), 5);
 *
 * @since 0.10.0
 */
export const maximum: <A>(ord: Ord<A>) => (xs: ReadonlyNonEmptyArray<A>) => A =
  flow(max, NEA.concatAll)

/**
 * Greedy zip, preserving all items and expressing the possibility of unequal
 * input sizes via the `These` type.
 *
 * @example
 * import { zipAll } from 'fp-ts-std/ReadonlyArray';
 * import * as T from 'fp-ts/These'
 *
 * assert.deepStrictEqual(zipAll([3, 4, 5, 6])([1, 2]), [T.both(1, 3), T.both(2, 4), T.right(5), T.right(6)])
 *
 * @since 0.11.0
 */
export const zipAll =
  <A>(xs: ReadonlyArray<A>) =>
  <B>(ys: ReadonlyArray<B>): ReadonlyArray<These<B, A>> => {
    const zs = RA.zip(ys, xs)
    const getRem = slice(RA.size(zs))(Infinity)

    const rest = pipe(
      ordNumber.compare(RA.size(ys), RA.size(xs)),
      orderingMatch<ReadonlyArray<These<B, A>>>(
        () => pipe(xs, getRem, RA.map(T.right)),
        constant(RA.empty),
        () => pipe(ys, getRem, RA.map(T.left)),
      ),
    )

    return pipe(
      zs,
      RA.map(([za, zb]) => T.both(za, zb)),
      RA.concat(rest),
    )
  }

/**
 * Filter an array based upon a predicate whose boolean is returned in an
 * applicative context. This can be helpful if your predicate is asynchronous
 * and therefore `Task`-based, for example.
 *
 * @example
 * import * as T from "fp-ts/Task";
 * import { Task } from "fp-ts/Task";
 * import { filterA } from "fp-ts-std/ReadonlyArray";
 *
 * const asyncIsEven = (n: number): Task<boolean> => T.of(n % 2 === 0);
 *
 * filterA(T.ApplicativePar)(asyncIsEven)([1, 2, 3, 4, 5])().then((xs) => {
 *     assert.deepStrictEqual(xs, [2, 4]);
 * });
 *
 * @since 0.12.0
 */
export function filterA<F extends URIS4>(
  F: Applicative4<F>,
): <S, R, E, A>(
  p: (x: A) => Kind4<F, S, R, E, boolean>,
) => (xs: ReadonlyArray<A>) => Kind4<F, S, R, E, ReadonlyArray<A>>
export function filterA<F extends URIS3>(
  F: Applicative3<F>,
): <R, E, A>(
  p: (x: A) => Kind3<F, R, E, boolean>,
) => (xs: ReadonlyArray<A>) => Kind3<F, R, E, ReadonlyArray<A>>
export function filterA<F extends URIS2>(
  F: Applicative2<F>,
): <E, A>(
  p: (x: A) => Kind2<F, E, boolean>,
) => (xs: ReadonlyArray<A>) => Kind2<F, E, ReadonlyArray<A>>
export function filterA<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A>(
  p: (x: A) => Kind2<F, E, boolean>,
) => (xs: ReadonlyArray<A>) => Kind2<F, E, ReadonlyArray<A>>
export function filterA<F extends URIS>(
  F: Applicative1<F>,
): <A>(
  p: (x: A) => Kind<F, boolean>,
) => (xs: ReadonlyArray<A>) => Kind<F, ReadonlyArray<A>>
export function filterA<F>(
  F: Applicative<F>,
): <A>(
  p: (x: A) => HKT<F, boolean>,
) => (xs: ReadonlyArray<A>) => HKT<F, ReadonlyArray<A>>
export function filterA<F>(
  F: Applicative<F>,
): <A>(
  p: (x: A) => HKT<F, boolean>,
) => (xs: ReadonlyArray<A>) => HKT<F, ReadonlyArray<A>> {
  return p => xs =>
    RA.Witherable.wither(F)(xs, x => F.map(p(x), y => (y ? O.some(x) : O.none)))
}
