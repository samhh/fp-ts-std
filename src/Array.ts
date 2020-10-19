import { Predicate, constant, pipe } from 'fp-ts/function';
import { Eq } from 'fp-ts/Eq';
import { Ord } from 'fp-ts/Ord';
import * as A from 'fp-ts/Array';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';

export const length = (xs: Array<unknown>): number => xs.length;

export const contains = A.elem;

export const containsFlipped = <A>(eq: Eq<A>) => (xs: Array<A>): Predicate<A> => y => A.elem(eq)(y)(xs);

export const any = <A>(f: Predicate<A>): Predicate<Array<A>> => xs => xs.some(f);

export const all = <A>(f: Predicate<A>): Predicate<Array<A>> => xs => xs.every(f);

export const join = (x: string) => (ys: Array<string>): string => ys.join(x);

/**
 * Like `fp-ts/lib/Array::getEq`, but items are not required to be in the same
 * order to determine equivalence. This function is therefore less efficient,
 * and `getEq` should be preferred on ordered data.
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
 * This can be thought of as analagous to `fp-ts/lib/Array::findFirst` where
 * the remaining items, sans the match (if any), are returned as well.
 */
export const pluckFirst = <A>(p: Predicate<A>) => (xs: Array<A>): [Option<A>, Array<A>] => pipe(
    A.findIndex(p)(xs),
    O.fold(
	constant([O.none, xs]),
	(i) => [O.some(xs[i]), A.unsafeDeleteAt(i, xs)],
    ),
);

export const upsert = <A>(eqA: Eq<A>) => (x: A) => (ys: Array<A>): Array<A> => pipe(
    A.findIndex<A>(y => eqA.equals(x, y))(ys),
    O.fold(
        constant(ys.concat(x)),
        (i) => A.unsafeUpdateAt(i, x, ys),
    ),
);

