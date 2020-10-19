import { fromCompare, Ord } from 'fp-ts/Ord';
import { invert as invertOrdering } from 'fp-ts/Ordering';
import { flow } from 'fp-ts/function';

export const getInvertedOrd = <A>(ord: Ord<A>): Ord<A> =>
    fromCompare(flow(ord.compare, invertOrdering));

