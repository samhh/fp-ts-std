/**
 * @since 0.1.0
 */

/**
 * Flip the function/argument order of a curried function.
 *
 * Note that due to limitations to the type system, this function won't work
 * correctly for generic functions.
 *
 * @example
 * import { flip } from 'fp-ts-std/Function';
 *
 * const prepend = (x: string) => (y: string): string => x + y;
 * const append = flip(prepend);
 *
 * assert.strictEqual(prepend('x')('y'), 'xy');
 * assert.strictEqual(append('x')('y'), 'yx');
 *
 * @since 0.1.0
 */
export const flip = <
    A extends Array<unknown>,
    B extends Array<unknown>,
    C,
// eslint-disable-next-line functional/functional-parameters
>(f: (...a: A) => (...b: B) => C) => (...b: B) => (...a: A): C => f(...a)(...b);

/**
 * Given a curried function with an iterative callback, this returns a new
 * function that behaves identically except that it also supplies an index for
 * each iteration of the callback.
 *
 * @example
 * import * as A from 'fp-ts/Array';
 * import { withIndex } from 'fp-ts-std/Function';
 *
 * const mapWithIndex = withIndex<number, number, number>(A.map);
 * assert.deepStrictEqual(mapWithIndex(i => x => x + i)([1, 2, 3]), [1, 3, 5]);
 *
 * @since 0.5.0
 */
export const withIndex:
    <A, B, C>(f: ((g: (x: A) => B) => (ys: A[]) => C[])) =>
    (g: (i: number) => (x: A) => B) =>
    (ys: A[]) =>
    C[]
    = f => g => xs => {
        let i = 0; // eslint-disable-line functional/no-let
        return f(y => g(i++)(y))(xs);
    };

