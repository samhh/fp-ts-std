/**
 * Utility functions to accommodate `fp-ts/TaskOption`.
 *
 * @since 0.15.0
 */

import { TaskOption } from "fp-ts/TaskOption"
import * as T from "fp-ts/Task"
import { execute as executeT } from "./Task"
import {
  unsafeUnwrap as unsafeUnwrapO,
  unsafeExpect as unsafeExpectO,
} from "./Option"
import { flow } from "fp-ts/function"

/**
 * Unwrap the promise from within a `TaskOption`, rejecting if `None`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/TaskOption'
 * import * as TO from 'fp-ts/TaskOption'
 *
 * unsafeUnwrap(TO.of(5)).then((x) => {
 *   assert.strictEqual(x, 5)
 * })
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const unsafeUnwrap: <A>(x: TaskOption<A>) => Promise<A> = flow(
  T.map(unsafeUnwrapO),
  executeT,
)

/**
 * Unwrap the promise from within a `TaskOption`, rejecting with `msg` if
 * `None`.
 *
 * @example
 * import { unsafeExpect } from 'fp-ts-std/TaskOption'
 * import * as TO from 'fp-ts/TaskOption'
 *
 * assert.rejects(
 *   unsafeExpect('foo')(TO.none),
 *   /^foo$/,
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpect = (
  msg: string,
): (<A>(x: TaskOption<A>) => Promise<A>) =>
  flow(T.map(unsafeExpectO(msg)), executeT)
