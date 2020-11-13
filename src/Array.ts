/**
 * @since 0.1.0
 */

import { Predicate, constant, pipe, flow, Endomorphism } from "fp-ts/function"
import { Eq } from "fp-ts/Eq"
import { Ord } from "fp-ts/Ord"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"
import * as NEA from "fp-ts/NonEmptyArray"
import * as A from "fp-ts/Array"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { reduceM } from "fp-ts/Foldable"
import { monoidAll, monoidAny } from "fp-ts/Monoid"

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
