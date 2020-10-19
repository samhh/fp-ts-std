/**
 * @since 0.1.0
 */

import { fromCompare, Ord } from 'fp-ts/Ord';
import { invert as invertOrdering } from 'fp-ts/Ordering';
import { flow } from 'fp-ts/function';

/**
 * Invert the provided `Ord`.
 *
 * @since 0.1.0
 */
export const getInvertedOrd = <A>(ord: Ord<A>): Ord<A> =>
    fromCompare(flow(ord.compare, invertOrdering));

