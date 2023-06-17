/**
 * Utility functions to accommodate `fp-ts/IOOption`.
 *
 * @since 0.16.0
 */

import * as IOO from "fp-ts/IOOption"
import IOOption = IOO.IOOption
import * as IO from "fp-ts/IO"
import { execute as executeIO } from "./IO"
import {
  unsafeUnwrap as unsafeUnwrapO,
  unsafeExpect as unsafeExpectO,
} from "./Option"
import { flow } from "fp-ts/function"
import { pass as _pass } from "./Applicative"

/**
 * Unwrap the value from within an `IOOption`, throwing if `None`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/IOOption'
 * import * as IOO from 'fp-ts/IOOption'
 *
 * assert.strictEqual(unsafeUnwrap(IOO.some(5)), 5)
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeUnwrap: <A>(x: IOOption<A>) => A = flow(
  IO.map(unsafeUnwrapO),
  executeIO,
)

/**
 * Unwrap the value from within an `IOOption`, throwing `msg` if `None`.
 *
 * @example
 * import { unsafeExpect } from 'fp-ts-std/IOOption'
 * import * as IOO from 'fp-ts/IOOption'
 *
 * assert.throws(
 *   () => unsafeExpect('foo')(IOO.none),
 *   /^foo$/,
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpect = (msg: string): (<A>(x: IOOption<A>) => A) =>
  flow(IO.map(unsafeExpectO(msg)), executeIO)

/**
 * Convenient alias for `IOO.of(undefined)`.
 *
 * @example
 * import { flow, pipe, constant } from 'fp-ts/function'
 * import * as Fn from 'fp-ts-std/Function'
 * import * as O from 'fp-ts/Option'
 * import Option = O.Option
 * import * as IOO from 'fp-ts/IOOption'
 * import IOOption = IOO.IOOption
 * import { pass } from 'fp-ts-std/IOOption'
 * import { log } from 'fp-ts/Console'
 *
 * const mcount: Option<number> = O.some(123)
 * const tryLog: <A>(x: A) => IOOption<void> = flow(log, IOO.fromIO)
 *
 * const logCount: IOOption<void> = pipe(
 *   mcount,
 *   O.match(
 *     constant(pass),
 *     tryLog,
 *   ),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const pass: IOOption<void> = _pass(IOO.Applicative)
