/**
 * Helpers for working with the environment in Node.js (located at
 * `process.env`).
 *
 * @since 0.9.0
 */

import { pipe, flow } from "fp-ts/lib/function.js"
import * as O from "fp-ts/lib/Option.js"
import * as IOO from "fp-ts/lib/IOOption.js"
import IOOption = IOO.IOOption
import * as NES from "./NonEmptyString.js"
import NonEmptyString = NES.NonEmptyString

/**
 * Attempt to get an environment parameter.
 *
 * @example
 * import { getParam } from 'fp-ts-std/Env'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getParam('example')(), O.none)
 * process.env['example'] = 'ciao'
 * assert.deepStrictEqual(getParam('example')(), O.some('ciao'))
 *
 * @category 3 Functions
 * @since 0.9.0
 */
export const getParam =
  (k: string): IOOption<string> =>
  () =>
    pipe(process.env[k], O.fromNullable)

/**
 * Attempt to get an environment parameter, filtering out empty strings.
 *
 * @example
 * import { getParamNonEmpty } from 'fp-ts-std/Env'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(getParamNonEmpty('missing')(), O.none)
 *
 * process.env['non-empty'] = 'ciao'
 * assert.deepStrictEqual(getParamNonEmpty('non-empty')(), O.some('ciao'))
 *
 * process.env['empty'] = ''
 * assert.deepStrictEqual(getParamNonEmpty('empty')(), O.none)
 *
 * @category 3 Functions
 * @since 0.9.0
 */
export const getParamNonEmpty: (k: string) => IOOption<NonEmptyString> = flow(
  getParam,
  IOO.chainOptionK(NES.fromString),
)
