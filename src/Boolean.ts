/**
 * Various functions to aid in working with booleans. You may also find the
 * `Predicate` module relevant.
 *
 * @since 0.1.0
 */

import { Endomorphism } from "fp-ts/Endomorphism"
import { SemigroupAll, SemigroupAny, Ord } from "fp-ts/boolean"
import { curry2 } from "./Function"
import * as O from "fp-ts/Option"
import * as Bounded_ from "fp-ts/Bounded"
type Bounded<A> = Bounded_.Bounded<A>
import type { Enum as _Enum } from "./Enum"
type Enum<A> = _Enum<A>
import * as L from "./Lazy"

/**
 * Invert a boolean.
 *
 * @example
 * import { invert } from 'fp-ts-std/Boolean'
 *
 * assert.strictEqual(invert(true), false)
 * assert.strictEqual(invert(false), true)
 *
 * @category 3 Functions
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
 * @category 3 Functions
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
 * @category 3 Functions
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
 * @category 3 Functions
 * @since 0.4.0
 */
export const xor =
  (x: boolean): Endomorphism<boolean> =>
  y =>
    (x && !y) || (!x && y)

/**
 * A `Bounded` instance for booleans.
 *
 * @example
 * import { Bounded } from 'fp-ts-std/Boolean'
 *
 * assert.strictEqual(Bounded.top, true)
 * assert.strictEqual(Bounded.bottom, false)
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const Bounded: Bounded<boolean> = {
  ...Ord,
  top: true,
  bottom: false,
}

/**
 * An `Enum` instance for booleans.
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { Enum } from 'fp-ts-std/Boolean'
 *
 * assert.deepStrictEqual(Enum.succ(false), O.some(true))
 * assert.deepStrictEqual(Enum.succ(true), O.none)
 *
 * assert.deepStrictEqual(Enum.pred(true), O.some(false))
 * assert.deepStrictEqual(Enum.pred(false), O.none)
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const Enum: Enum<boolean> = {
  ...Bounded,
  succ: x => (x ? O.none : O.some(true)),
  pred: x => (x ? O.some(false) : O.none),
  toEnum: n => (n === 1 ? O.some(true) : n === 0 ? O.some(false) : O.none),
  fromEnum: Number,
  cardinality: L.of(2),
}
