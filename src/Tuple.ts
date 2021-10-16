/**
 * Various functions to aid in working with tuples.
 *
 * @since 0.12.0
 */

/**
 * Apply a function, collecting the output alongside the input. A dual to
 * `toSnd`.
 *
 * @example
 * import { toFst } from 'fp-ts-std/Tuple';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(toFst(fromNumber)(5), ['5', 5]);
 *
 * @since 0.12.0
 */
export const toFst =
  <A, B>(f: (x: A) => B) =>
  (x: A): [B, A] =>
    [f(x), x]

/**
 * Apply a function, collecting the input alongside the output. A dual to
 * `toFst`.
 *
 * @example
 * import { toFst } from 'fp-ts-std/Tuple';
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(toFst(fromNumber)(5), ['5', 5]);
 *
 * @since 0.12.0
 */
export const toSnd =
  <A, B>(f: (x: A) => B) =>
  (x: A): [A, B] =>
    [x, f(x)]
