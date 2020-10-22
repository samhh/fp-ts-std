/**
 * @since 0.1.0
 */

import { Predicate, constant, pipe } from 'fp-ts/function';
import { Eq } from 'fp-ts/Eq';
import { Ord } from 'fp-ts/Ord';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as A from 'fp-ts/Array';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';

/**
 * Get the length of an array.
 *
 * @since 0.1.0
 */
export const length = (xs: Array<unknown>): number => xs.length;

/**
 * Like `fp-ts/Array::elem`, but flipped.
 *
 * @since 0.1.0
 */
export const elemFlipped = <A>(eq: Eq<A>) => (xs: Array<A>): Predicate<A> => y => A.elem(eq)(y)(xs);

/**
 * Check if a predicate holds true for any array member.
 *
 * @since 0.1.0
 */
export const any = <A>(f: Predicate<A>): Predicate<Array<A>> => xs => xs.some(f);

/**
 * Check if a predicate holds true for every array member.
 *
 * @since 0.1.0
 */
export const all = <A>(f: Predicate<A>): Predicate<Array<A>> => xs => xs.every(f);

/**
 * Join an array of strings together into a single string using the supplied
 * separator.
 *
 * @since 0.1.0
 */
export const join = (x: string) => (ys: Array<string>): string => ys.join(x);

/**
 * Like `fp-ts/Array::getEq`, but items are not required to be in the same
 * order to determine equivalence. This function is therefore less efficient,
 * and `getEq` should be preferred on ordered data.
 *
 * @since 0.1.0
 */
export const getDisorderedEq = <A>(ordA: Ord<A>): Eq<Array<A>> => ({
    equals: (xs: Array<A>, ys: Array<A>) => {
        const sort = A.sort(ordA);

        return A.getEq(ordA).equals(sort(xs), sort(ys));
    },
});

/**
 * Pluck the first item out of an array matching a predicate. Any further
 * matches will be left untouched.
 *
 * This can be thought of as analagous to `fp-ts/Array::findFirst` where
 * the remaining items, sans the match (if any), are returned as well.
 *
 * @since 0.1.0
 */
export const pluckFirst = <A>(p: Predicate<A>) => (xs: Array<A>): [Option<A>, Array<A>] => pipe(
    A.findIndex(p)(xs),
    O.fold(
	constant([O.none, xs]),
	(i) => [O.some(xs[i]), A.unsafeDeleteAt(i, xs)],
    ),
);

/**
 * Update an item in an array or, if it's not present yet, insert it.
 *
 * If the item exists more than once (as determined by the supplied `Eq`
 * instance), only the first to be found will be updated. The order in which
 * the array is checked is unspecified.
 *
 * @since 0.1.0
 */
export const upsert = <A>(eqA: Eq<A>) => (x: A) => (ys: Array<A>): NonEmptyArray<A> => pipe(
    A.findIndex<A>(y => eqA.equals(x, y))(ys),
    O.map((i) => A.unsafeUpdateAt(i, x, ys)),
    O.chain(NEA.fromArray),
    O.getOrElse(() => NEA.snoc(ys, x)),
);

