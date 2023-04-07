/**
 * Utility functions to accommodate `fp-ts/IOOption`.
 *
 * @since 0.16.0
 */

import { IOOption } from "fp-ts/IOOption"
import * as IO from "fp-ts/IO"
import { execute as executeIO } from "./IO"
import {
  unsafeUnwrap as unsafeUnwrapO,
  unsafeExpect as unsafeExpectO,
} from "./Option"
import { flow } from "fp-ts/function"

/**
 * Unwrap the value from within an `IOOption`, throwing if `None`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/IOOption'
 * import * as IOO from 'fp-ts/IOOption'
 *
 * assert.strictEqual(unsafeUnwrap(IOO.some(5)), 5)
 *
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
 * @since 0.16.0
 */
export const unsafeExpect = (msg: string): (<A>(x: IOOption<A>) => A) =>
  flow(IO.map(unsafeExpectO(msg)), executeIO)
