/**
 * Utility functions to accommodate `fp-ts/TaskOption`.
 *
 * @since 0.15.0
 */

import * as TO from "fp-ts/TaskOption"
type TaskOption<A> = TO.TaskOption<A>
import * as T from "fp-ts/Task"
import { execute as executeT } from "./Task"
import {
  unsafeUnwrap as unsafeUnwrapO,
  unsafeExpect as unsafeExpectO,
} from "./Option"
import { flow } from "fp-ts/function"
import { pass as _pass } from "./Applicative"

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
 *   Error('Unwrapped `None`'),
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpect = (
  msg: string,
): (<A>(x: TaskOption<A>) => Promise<A>) =>
  flow(T.map(unsafeExpectO(msg)), executeT)

/**
 * Convenient alias for `TO.of(undefined)`.
 *
 * @example
 * import { flow, pipe, constant } from 'fp-ts/function'
 * import * as Fn from 'fp-ts-std/Function'
 * import * as O from 'fp-ts/Option'
 * import Option = O.Option
 * import * as TO from 'fp-ts/TaskOption'
 * import TaskOption = TO.TaskOption
 * import { pass } from 'fp-ts-std/TaskOption'
 * import { log } from 'fp-ts/Console'
 *
 * const mcount: Option<number> = O.some(123)
 * const tryAsyncLog: <A>(x: A) => TaskOption<void> = flow(log, TO.fromIO)
 *
 * const logCount: TaskOption<void> = pipe(
 *   mcount,
 *   O.match(
 *     constant(pass),
 *     tryAsyncLog,
 *   ),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const pass: TaskOption<void> = _pass(TO.ApplicativePar)
