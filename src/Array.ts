/**
 * @since 0.1.0
 */

import {
  Predicate,
  constant,
  pipe,
  flow,
  Endomorphism,
  not,
} from "fp-ts/function"
import { Eq } from "fp-ts/Eq"
import { Ord } from "fp-ts/Ord"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"
import * as NEA from "fp-ts/NonEmptyArray"
import * as A from "fp-ts/Array"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { reduceM } from "fp-ts/Foldable"
import {
  fold,
  monoidAll,
  monoidAny,
  monoidProduct,
  monoidSum,
} from "fp-ts/Monoid"
import { flip } from "./Function"

/**
 * Get the length of an array.
 *
 * @example
 * import { length } from 'fp-ts-std/Array';
 *
 * assert.strictEqual(length(['a', 'b', 'c']), 3);
 *
 * @since 0.1.0
 */
export const length = (xs: Array<unknown>): number => xs.length

/**
 * Like `fp-ts/Array::elem`, but flipped.
 *
 * @example
 * import { elemFlipped } from 'fp-ts-std/Array';
 * import { eqString } from 'fp-ts/Eq';
 *
 * const isLowerVowel = elemFlipped(eqString)(['a', 'e', 'i', 'o', 'u']);
 *
 * assert.strictEqual(isLowerVowel('a'), true);
 * assert.strictEqual(isLowerVowel('b'), false);
 *
 * @since 0.1.0
 */
export const elemFlipped = <A>(eq: Eq<A>) => (
  xs: Array<A>,
): Predicate<A> => y => A.elem(eq)(y)(xs)

/**
 * Check if a predicate holds true for any array member.
 *
 * @example
 * import { any } from 'fp-ts-std/Array';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isFive: Predicate<number> = n => n === 5;
 * const isAnyFive = any(isFive);
 *
 * assert.strictEqual(isAnyFive([3, 5, 7]), true);
 * assert.strictEqual(isAnyFive([3, 4, 7]), false);
 *
 * @since 0.1.0
 */
export const any: <A>(f: Predicate<A>) => Predicate<Array<A>> = A.foldMap(
  monoidAny,
)

/**
 * Check if a predicate holds true for every array member.
 *
 * @example
 * import { all } from 'fp-ts-std/Array';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isFive: Predicate<number> = n => n === 5;
 * const isAllFive = all(isFive);
 *
 * assert.strictEqual(isAllFive([5, 5, 5]), true);
 * assert.strictEqual(isAllFive([5, 4, 5]), false);
 *
 * @since 0.1.0
 */
export const all: <A>(f: Predicate<A>) => Predicate<Array<A>> = A.foldMap(
  monoidAll,
)

/**
 * Check if a predicate does not hold for any array member.
 *
 * import { none } from 'fp-ts-std/Array';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isFive: Predicate<number> = n => n === 5;
 * const noneAreFive = none(isFive);
 *
 * assert.strictEqual(noneAreFive([4, 4, 4]), true);
 * assert.strictEqual(noneAreFive([4, 5, 4]), false);
 *
 * @since 0.7.0
 */
export const none: <A>(f: Predicate<A>) => Predicate<Array<A>> = flow(not, all)

/**
 * Join an array of strings together into a single string using the supplied
 * separator.
 *
 * @example
 * import { join } from 'fp-ts-std/Array';
 *
 * const commaSepd = join(',');
 *
 * assert.strictEqual(commaSepd([]), '');
 * assert.strictEqual(commaSepd(['a']), 'a');
 * assert.strictEqual(commaSepd(['a', 'b', 'c']), 'a,b,c');
 *
 * @since 0.1.0
 */
export const join = (x: string) => (ys: Array<string>): string => ys.join(x)

/**
 * Like `fp-ts/Array::getEq`, but items are not required to be in the same
 * order to determine equivalence. This function is therefore less efficient,
 * and `getEq` should be preferred on ordered data.
 *
 * @example
 * import { getEq } from 'fp-ts/Array';
 * import { getDisorderedEq } from 'fp-ts-std/Array';
 * import { ordNumber } from 'fp-ts/Ord';
 *
 * const f = getEq(ordNumber);
 * const g = getDisorderedEq(ordNumber);
 *
 * assert.strictEqual(f.equals([1, 2, 3], [1, 3, 2]), false);
 * assert.strictEqual(g.equals([1, 2, 3], [1, 3, 2]), true);
 *
 * @since 0.1.0
 */
export const getDisorderedEq = <A>(ordA: Ord<A>): Eq<Array<A>> => ({
  equals: (xs: Array<A>, ys: Array<A>) => {
    const sort = A.sort(ordA)

    return A.getEq(ordA).equals(sort(xs), sort(ys))
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
 * import { pluckFirst } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isOverFive: Predicate<number> = n => n > 5;
 * const pluckFirstOverFive = pluckFirst(isOverFive);
 *
 * assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5]), [O.none, [1, 3, 5]]);
 * assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5, 7, 9]), [O.some(7), [1, 3, 5, 9]]);
 *
 * @since 0.1.0
 */
export const pluckFirst = <A>(p: Predicate<A>) => (
  xs: Array<A>,
): [Option<A>, Array<A>] =>
  pipe(
    A.findIndex(p)(xs),
    O.fold(constant([O.none, xs]), i => [
      O.some(xs[i]),
      A.unsafeDeleteAt(i, xs),
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
 * import { upsert } from 'fp-ts-std/Array';
 * import { eqString, contramap } from 'fp-ts/Eq';
 *
 * type Account = {
 *     id: string;
 *     name: string;
 * };
 *
 * const eqAccount = contramap<string, Account>(acc => acc.id)(eqString);
 *
 * const accounts: Array<Account> = [{
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
 * @since 0.1.0
 */
export const upsert = <A>(eqA: Eq<A>) => (x: A) => (
  ys: Array<A>,
): NonEmptyArray<A> =>
  pipe(
    A.findIndex<A>(y => eqA.equals(x, y))(ys),
    O.map(i => A.unsafeUpdateAt(i, x, ys)),
    O.chain(NEA.fromArray),
    O.getOrElse(() => NEA.snoc(ys, x)),
  )

/**
 * Insert all the elements of an array into another array at the specified
 * index. Returns `None` if the index is out of bounds.
 *
 * The array of elements to insert must be non-empty.
 *
 * @example
 * import { insertMany } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 *
 * const f = insertMany(1)(['a', 'b']);
 * assert.deepStrictEqual(f([]), O.none);
 * assert.deepStrictEqual(f(['x']), O.some(['x', 'a', 'b']));
 * assert.deepStrictEqual(f(['x', 'y']), O.some(['x', 'a', 'b', 'y']));
 *
 * @since 0.5.0
 */
export const insertMany = (i: number) => <A>(xs: NonEmptyArray<A>) => (
  ys: Array<A>,
): Option<NonEmptyArray<A>> =>
  pipe(
    xs,
    A.reverse,
    reduceM(O.Monad, A.Foldable)(ys, (zs, x) => pipe(zs, A.insertAt(i, x))),
    O.chain(NEA.fromArray),
  )

/**
 * Filter a list, removing any elements that repeat that directly preceding
 * them.
 *
 * @example
 * import { dropRepeats } from 'fp-ts-std/Array';
 * import { eqNumber } from 'fp-ts/Eq'
 *
 * assert.deepStrictEqual(dropRepeats(eqNumber)([1, 2, 2, 3, 2, 4, 4]), [1, 2, 3, 2, 4]);
 *
 * @since 0.6.0
 */
export const dropRepeats: <A>(eq: Eq<A>) => Endomorphism<Array<A>> = eq => xs =>
  pipe(
    xs,
    A.filterWithIndex((i, x) => i === 0 || !eq.equals(x, xs[i - 1])),
  )

/**
 * Check if an array starts with the specified subarray.
 *
 * @example
 * import { startsWith } from 'fp-ts-std/Array';
 * import { eqString } from 'fp-ts/Eq'
 *
 * const startsXyz = startsWith(eqString)(['x', 'y', 'z']);
 *
 * assert.strictEqual(startsXyz(['x', 'y', 'z', 'a']), true);
 * assert.strictEqual(startsXyz(['a', 'x', 'y', 'z']), false);
 *
 * @since 0.7.0
 */
export const startsWith = <A>(eq: Eq<A>) => (
  start: Array<A>,
): Predicate<Array<A>> =>
  flow(A.takeLeft(start.length), xs => A.getEq(eq).equals(xs, start))

/**
 * Check if an array ends with the specified subarray.
 *
 * @example
 * import { endsWith } from 'fp-ts-std/Array';
 * import { eqString } from 'fp-ts/Eq'
 *
 * const endsXyz = endsWith(eqString)(['x', 'y', 'z']);
 *
 * assert.strictEqual(endsXyz(['a', 'x', 'y', 'z']), true);
 * assert.strictEqual(endsXyz(['a', 'x', 'b', 'z']), false);
 *
 * @since 0.6.0
 */
export const endsWith = <A>(eq: Eq<A>) => (
  end: Array<A>,
): Predicate<Array<A>> =>
  flow(A.takeRight(end.length), xs => A.getEq(eq).equals(xs, end))

/**
 * Returns a new array without the values present in the first input array.
 *
 * @example
 * import { without } from 'fp-ts-std/Array';
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
 * @since 0.6.0
 */
export const without = <A>(eq: Eq<A>) => (
  xs: Array<A>,
): Endomorphism<Array<A>> => flow(A.filter(y => !A.elem(eq)(y)(xs)))

/**
 * Returns the {@link https://en.wikipedia.org/wiki/Cartesian_product Cartesian product}
 * of two arrays. In other words, returns an array containing tuples of every
 * possible ordered combination of the two input arrays.
 *
 * @example
 * import { cartesian } from 'fp-ts-std/Array';
 *
 * assert.deepStrictEqual(
 *     cartesian([1, 2])(['a', 'b', 'c']),
 *     [[1, 'a'], [1, 'b'], [1, 'c'], [2, 'a'], [2, 'b'], [2, 'c']],
 * );
 *
 * @since 0.6.0
 */
export const cartesian = <A>(xs: Array<A>) => <B>(
  ys: Array<B>,
): Array<[A, B]> =>
  pipe(
    xs,
    A.chain(x =>
      pipe(
        ys,
        A.map(y => [x, y]),
      ),
    ),
  )

/**
 * Adds together all the numbers in the input array.
 *
 * @example
 * import { sum } from 'fp-ts-std/Array';
 *
 * assert.strictEqual(sum([]), 0);
 * assert.strictEqual(sum([25, 3, 10]), 38);
 *
 * @since 0.6.0
 */
export const sum = fold(monoidSum)

/**
 * Multiplies together all the numbers in the input array.
 *
 * @example
 * import { product } from 'fp-ts-std/Array';
 *
 * assert.strictEqual(product([]), 1);
 * assert.strictEqual(product([5]), 5);
 * assert.strictEqual(product([4, 2, 3]), 24);
 *
 * @since 0.6.0
 */
export const product = fold(monoidProduct)

/**
 * Returns an array of tuples of the specified length occupied by consecutive
 * elements.
 *
 * If `n` is not a positive number, an empty array is returned.
 *
 * If `n` is greater than the length of the array, an empty array is returned.
 *
 * @example
 * import { aperture } from 'fp-ts-std/Array';
 *
 * assert.deepStrictEqual(aperture(1)([1, 2, 3, 4]), [[1], [2], [3], [4]]);
 * assert.deepStrictEqual(aperture(2)([1, 2, 3, 4]), [[1, 2], [2, 3], [3, 4]]);
 * assert.deepStrictEqual(aperture(3)([1, 2, 3, 4]), [[1, 2, 3], [2, 3, 4]]);
 * assert.deepStrictEqual(aperture(4)([1, 2, 3, 4]), [[1, 2, 3, 4]]);
 *
 * @since 0.7.0
 */
export const aperture = (n: number) => <A>(xs: Array<A>): Array<Array<A>> => {
  const go = (i: number) => (ys: Array<Array<A>>): Array<Array<A>> =>
    i + n > xs.length ? ys : go(i + 1)(A.snoc(ys, slice(i)(n + i)(xs)))

  return n < 1 ? [] : go(0)([])
}

/**
 * Returns the elements of the array between the start index (inclusive) and the
 * end index (exclusive).
 *
 * This is merely a functional wrapper around `Array.prototype.slice`.
 *
 * @example
 * import { slice } from 'fp-ts-std/Array';
 *
 * const xs = ['a', 'b', 'c', 'd'];
 *
 * assert.deepStrictEqual(slice(1)(3)(xs), ['b', 'c']);
 * assert.deepStrictEqual(slice(1)(Infinity)(xs), ['b', 'c', 'd']);
 * assert.deepStrictEqual(slice(0)(-1)(xs), ['a', 'b', 'c']);
 * assert.deepStrictEqual(slice(-3)(-1)(xs), ['b', 'c']);
 *
 * @since 0.7.0
 */
export const slice = (start: number) => (end: number) => <A>(
  xs: Array<A>,
): Array<A> => xs.slice(start, end)

/**
 * Filters out items in the array for which the predicate holds. This can be
 * thought of as the inverse of ordinary array filtering.
 *
 * @example
 * import { reject } from 'fp-ts-std/Array';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 *
 * assert.deepStrictEqual(reject(isEven)([1, 2, 3, 4]), [1, 3]);
 *
 * @since 0.7.0
 */
export const reject = <A>(f: Predicate<A>): Endomorphism<Array<A>> =>
  A.filter(not(f))

/**
 * Move an item at index `from` to index `to`. See also `moveTo`.
 *
 * If either index is out of bounds, `None` is returned.
 *
 * If both indices are the same, the array is returned unchanged.
 *
 * @example
 * import { moveFrom } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(moveFrom(0)(1)(['a', 'b', 'c']), O.some(['b', 'a', 'c']));
 * assert.deepStrictEqual(moveFrom(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']));
 * assert.deepStrictEqual(moveFrom(0)(0)([]), O.none);
 * assert.deepStrictEqual(moveFrom(0)(1)(['a']), O.none);
 * assert.deepStrictEqual(moveFrom(1)(0)(['a']), O.none);
 *
 * @since 0.7.0
 */
export const moveFrom = (from: number) => (to: number) => <A>(
  xs: Array<A>,
): Option<Array<A>> =>
  from >= xs.length || to >= xs.length
    ? O.none
    : from === to
    ? O.some(xs)
    : pipe(
        xs,
        A.lookup(from),
        O.chain(x => pipe(A.deleteAt(from)(xs), O.chain(A.insertAt(to, x)))),
      )

/**
 * Move an item at index `from` to index `to`. See also `moveFrom`.
 *
 * If either index is out of bounds, `None` is returned.
 *
 * If both indices are the same, the array is returned unchanged.
 *
 * @example
 * import { moveTo } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(moveTo(1)(0)(['a', 'b', 'c']), O.some(['b', 'a', 'c']));
 * assert.deepStrictEqual(moveTo(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']));
 * assert.deepStrictEqual(moveTo(0)(0)([]), O.none);
 * assert.deepStrictEqual(moveTo(0)(1)(['a']), O.none);
 * assert.deepStrictEqual(moveTo(1)(0)(['a']), O.none);
 *
 * @since 0.7.0
 */
export const moveTo = flip(moveFrom)
