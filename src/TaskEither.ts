/**
 * Utility functions to accommodate `fp-ts/TaskEither`.
 *
 * @since 0.12.0
 */

import { TaskEither } from "fp-ts/TaskEither"
import * as TE from "fp-ts/TaskEither"
import * as T from "fp-ts/Task"
import { execute as executeT } from "./Task"
import {
  unsafeUnwrap as unsafeUnwrapE,
  unsafeUnwrapLeft as unsafeUnwrapLeftE,
} from "./Either"
import { flow } from "fp-ts/function"
import { mapBoth as _mapBoth } from "./Bifunctor"

/**
 * Unwrap the promise from within a `TaskEither`, rejecting with the inner
 * value of `Left` if `Left`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/TaskEither'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * unsafeUnwrap(TE.right(5)).then((x) => {
 *   assert.strictEqual(x, 5)
 * })
 *
 * @since 0.12.0
 */
export const unsafeUnwrap: <A>(x: TaskEither<unknown, A>) => Promise<A> = flow(
  T.map(unsafeUnwrapE),
  executeT,
)

/**
 * Unwrap the promise from within a `TaskEither`, throwing the inner value of
 * `Right` if `Right`.
 *
 * @example
 * import { unsafeUnwrapLeft } from 'fp-ts-std/TaskEither'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * unsafeUnwrapLeft(TE.left(5)).then((x) => {
 *   assert.strictEqual(x, 5)
 * })
 *
 * @since 0.12.0
 */

export const unsafeUnwrapLeft: <E>(x: TaskEither<E, unknown>) => Promise<E> =
  flow(T.map(unsafeUnwrapLeftE), executeT)

/**
 * Apply a function to both elements of an `TaskEither`.
 *
 * @example
 * import * as TE from 'fp-ts/TaskEither'
 * import * as E from 'fp-ts/Either'
 * import { mapBoth } from 'fp-ts-std/TaskEither'
 * import { multiply } from 'fp-ts-std/Number'
 *
 * const f = mapBoth(multiply(2))
 *
 * f(TE.left(3))().then((x) => {
 *   assert.deepStrictEqual(x, E.left(6))
 * })
 * f(TE.right(3))().then((x) => {
 *   assert.deepStrictEqual(x, E.right(6))
 * })
 *
 * @since 0.14.0
 */
export const mapBoth: <A, B>(
  f: (x: A) => B,
) => (xs: TaskEither<A, A>) => TaskEither<B, B> = _mapBoth(TE.Bifunctor)
