/**
 * Utility functions to accommodate `fp-ts/ReaderTaskEither`.
 *
 * @since 0.14.3
 */
import * as RTE from "fp-ts/ReaderTaskEither"
import {
  unsafeUnwrap as unsafeUnwrapTE,
  unsafeUnwrapLeft as unsafeUnwrapLeftTE,
} from "./TaskEither"

/**
 * Unwrap the promise from within a `ReaderTaskEither`, rejecting with the inner
 * value of `Left` if `Left`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/ReaderTaskEither';
 * import * as RTE from 'fp-ts/ReaderTaskEither';
 *
 * unsafeUnwrap(RTE.right(5))({}).then((x) => {
 *   assert.strictEqual(x, 5);
 * });
 *
 * @since 0.14.3
 */
export const unsafeUnwrap =
  <R, A>(rte: RTE.ReaderTaskEither<R, unknown, A>) =>
  (r: R): Promise<A> =>
    unsafeUnwrapTE(rte(r))

/**
 * Unwrap the promise from within a `ReaderTaskEither`, throwing the inner value of
 * `Right` if `Right`.
 *
 * @example
 * import { unsafeUnwrapLeft } from 'fp-ts-std/ReaderTaskEither';
 * import * as RTE from 'fp-ts/ReaderTaskEither';
 *
 * unsafeUnwrapLeft(RTE.left(5))({}).then((x) => {
 *   assert.strictEqual(x, 5);
 * });
 *
 * @since 0.14.3
 */
export const unsafeUnwrapLeft =
  <R, E>(rte: RTE.ReaderTaskEither<R, E, unknown>) =>
  (r: R): Promise<E> =>
    unsafeUnwrapLeftTE(rte(r))
