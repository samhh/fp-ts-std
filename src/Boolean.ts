/**
 * Various functions to aid in working with booleans. You may also find the
 * `Predicate` module relevant.
 *
 * @since 0.1.0
 */

import { Endomorphism } from "fp-ts/Endomorphism"
import { SemigroupAll, SemigroupAny } from "fp-ts/boolean"
import { curry2 } from "./Function"

/**
 * Invert a boolean.
 *
 * @example
 * import { invert } from 'fp-ts-std/Boolean'
 *
 * assert.strictEqual(invert(true), false)
 * assert.strictEqual(invert(false), true)
 *
 * @since 0.4.0
 */
export const invert: Endomorphism<boolean> = x => !x

/**
 * Returns `true` if both arguments are `true`, else `false`. Equivalent to
 * logical conjunction.
 *
 * @example
 * import { and } from 'fp-ts-std/Boolean'
 *
 * assert.strictEqual(and(true)(true), true)
 * assert.strictEqual(and(true)(false), false)
 *
 * @since 0.4.0
 */
export const and: (x: boolean) => Endomorphism<boolean> = curry2(
  SemigroupAll.concat,
)

/**
 * Returns `true` if one or both arguments are `true`, else `false`. Equivalent
 * to logical disjunction.
 *
 * @example
 * import { or } from 'fp-ts-std/Boolean'
 *
 * assert.strictEqual(or(true)(false), true)
 * assert.strictEqual(or(false)(false), false)
 *
 * @since 0.4.0
 */
export const or: (x: boolean) => Endomorphism<boolean> = curry2(
  SemigroupAny.concat,
)

/**
 * Returns `true` if one argument is `true` and the other is `false`, else
 * `false`. Equivalent to exclusive logical disjunction.
 *
 * @example
 * import { xor } from 'fp-ts-std/Boolean'
 *
 * assert.strictEqual(xor(true)(false), true)
 * assert.strictEqual(xor(true)(true), false)
 *
 * @since 0.4.0
 */
export const xor =
  (x: boolean): Endomorphism<boolean> =>
  y =>
    (x && !y) || (!x && y)
