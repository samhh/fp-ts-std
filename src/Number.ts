/**
 * Various functions to aid in working with numbers.
 *
 * @since 0.1.0
 */

import { flow, identity, pipe } from "fp-ts/function"
import { Predicate, not, and } from "fp-ts/Predicate"
import { Endomorphism } from "fp-ts/Endomorphism"
import * as O from "fp-ts/Option"
import Option = O.Option
import { unless } from "./Function.js"
import { Bounded as BoundedInfinity } from "fp-ts/number"
import { Enum } from "./Enum.js"
import { Bounded } from "fp-ts/Bounded"
import * as A from "fp-ts/Array"
import * as L from "./Lazy.js"

/**
 * Check if a number is actually valid. Specifically, all this function is
 * doing is checking whether or not the number is `NaN`.
 *
 * @example
 * import { isValid } from 'fp-ts-std/Number'
 *
 * const valid = 123
 * const invalid = NaN
 *
 * assert.strictEqual(isValid(valid), true)
 * assert.strictEqual(isValid(invalid), false)
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const isValid: Predicate<number> = not(Number.isNaN)

/**
 * Convert a string to a number.
 *
 * @example
 * import { fromStringWithRadix } from 'fp-ts-std/Number'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromStringWithRadix(16)('0xF'), some(15))
 * assert.deepStrictEqual(fromStringWithRadix(16)('xyz'), none)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const fromStringWithRadix =
  (radix: number) =>
  (string: string): Option<number> =>
    pipe(Number.parseInt(string, radix), O.fromPredicate(isValid))

/**
 * Convert a string to a number.
 *
 * @example
 * import { fromString } from 'fp-ts-std/Number'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromString('3'), some(3))
 * assert.deepStrictEqual(fromString('abc'), none)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const fromString: (string: string) => Option<number> =
  fromStringWithRadix(10)

/**
 * Convert a string to a floating point number.
 *
 * @example
 * import { floatFromString } from 'fp-ts-std/Number'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(floatFromString('3.3'), some(3.3))
 * assert.deepStrictEqual(floatFromString('abc'), none)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const floatFromString: (x: string) => Option<number> = flow(
  Number.parseFloat,
  O.fromPredicate(isValid),
)

/**
 * Increment a number.
 *
 * @example
 * import { increment } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(increment(3), 4)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const increment: Endomorphism<number> = x => x + 1

/**
 * Decrement a number.
 *
 * @example
 * import { decrement } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(decrement(3), 2)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const decrement: Endomorphism<number> = x => x - 1

/**
 * Add two numbers together.
 *
 * @example
 * import { add } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(add(2)(3), 5)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const add =
  (x: number): Endomorphism<number> =>
  y =>
    x + y

/**
 * Multiply two numbers together.
 *
 * @example
 * import { multiply } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(multiply(2)(3), 6)
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const multiply =
  (x: number): Endomorphism<number> =>
  y =>
    x * y

/**
 * Subtract the first number (the _subtrahend_) from the second number (the
 * _minuend_).
 *
 * @example
 * import { subtract } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(subtract(2)(3), 1)
 * assert.strictEqual(subtract(3)(2), -1)
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const subtract =
  (subtrahend: number): Endomorphism<number> =>
  minuend =>
    minuend - subtrahend

/**
 * Divide the second number (the _dividend_) by the first number (the
 * _divisor_).
 *
 * @example
 * import { divide } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(divide(2)(4), 2)
 * assert.strictEqual(divide(4)(2), .5)
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const divide =
  (divisor: number): Endomorphism<number> =>
  dividend =>
    dividend / divisor

/**
 * Calculates the remainder. See also `mod`.
 *
 * @example
 * import { rem } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(rem(2)(5.5), 1.5)
 * assert.strictEqual(rem(-4)(2), 2)
 * assert.strictEqual(rem(5)(-12), -2)
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const rem =
  (divisor: number): Endomorphism<number> =>
  dividend =>
    dividend % divisor

/**
 * Calculate the modulus. See also `rem`.
 *
 * @example
 * import { mod } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(mod(2)(5.5), 1.5)
 * assert.strictEqual(mod(-4)(2), -2)
 * assert.strictEqual(mod(5)(-12), 3)
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const mod =
  (divisor: number): Endomorphism<number> =>
  dividend =>
    ((dividend % divisor) + divisor) % divisor

/**
 * Unary negation.
 *
 * @example
 * import { negate } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(negate(42), -42)
 * assert.strictEqual(negate(-42), 42)
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const negate: Endomorphism<number> = n => -n

/**
 * Check if a number is finite.
 *
 * @example
 * import { isFinite } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(isFinite(123), true)
 * assert.strictEqual(isFinite(-123), true)
 * assert.strictEqual(isFinite(Infinity), false)
 * assert.strictEqual(isFinite(-Infinity), false)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const isFinite: Predicate<number> = n => Math.abs(n) !== Infinity

/**
 * If the provided number is `Infinity` or `-Infinity`, converts it to the
 * nearest safe finite number.
 *
 * @example
 * import { toFinite } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(toFinite(123), 123)
 * assert.strictEqual(toFinite(-123), -123)
 * assert.strictEqual(toFinite(Infinity), Number.MAX_SAFE_INTEGER)
 * assert.strictEqual(toFinite(-Infinity), Number.MIN_SAFE_INTEGER)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const toFinite: Endomorphism<number> = unless(isFinite)(
  n => Math.sign(n) * Number.MAX_SAFE_INTEGER,
)

/**
 * Check if a number is positive.
 *
 * @example
 * import { isPositive } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(isPositive(42), true)
 * assert.strictEqual(isPositive(0), false)
 * assert.strictEqual(isPositive(-42), false)
 *
 * @category 3 Functions
 * @since 0.13.0
 */
export const isPositive: Predicate<number> = n => Math.sign(n) === 1

/**
 * Check if a number is negative.
 *
 * @example
 * import { isNegative } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(isNegative(42), false)
 * assert.strictEqual(isNegative(0), false)
 * assert.strictEqual(isNegative(-42), true)
 *
 * @category 3 Functions
 * @since 0.13.0
 */
export const isNegative: Predicate<number> = n => Math.sign(n) === -1

/**
 * Check if a number is non-negative.
 *
 * @example
 * import { isNonNegative } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(isNonNegative(42), true)
 * assert.strictEqual(isNonNegative(0), true)
 * assert.strictEqual(isNonNegative(-42), false)
 *
 * @category 3 Functions
 * @since 0.13.0
 */
export const isNonNegative: Predicate<number> = n => Math.sign(n) !== -1

/**
 * Check if a number is non-positive.
 *
 * @example
 * import { isNonPositive } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(isNonPositive(42), false)
 * assert.strictEqual(isNonPositive(0), true)
 * assert.strictEqual(isNonPositive(-42), true)
 *
 * @category 3 Functions
 * @since 0.13.0
 */
export const isNonPositive: Predicate<number> = n => Math.sign(n) !== 1

/**
 * An alternative `Bounded` instance for numbers which defines top and bottom
 * as `Number.MAX_SAFE_INTEGER` and `Number.MIN_SAFE_INTEGER` respectively.
 *
 * @example
 * import { BoundedSafe } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(BoundedSafe.top, Number.MAX_SAFE_INTEGER)
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const BoundedSafe: Bounded<number> = {
  ...BoundedInfinity,
  top: Number.MAX_SAFE_INTEGER,
  bottom: Number.MIN_SAFE_INTEGER,
}

/**
 * An unlawful but predictable instance of `Enum` for numbers, representing
 * integers between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.
 *
 * Invalid inputs will return `None` for both `succ` and `pred`.
 *
 * `toEnum` and `fromEnum` do not modify the input.
 *
 * @example
 * import * as O from 'fp-ts/Option'
 * import { EnumInt } from 'fp-ts-std/Number'
 *
 * assert.deepStrictEqual(EnumInt.succ(123), O.some(124))
 * assert.deepStrictEqual(EnumInt.succ(123.5), O.none)
 *
 * assert.deepStrictEqual(EnumInt.pred(123), O.some(122))
 * assert.deepStrictEqual(EnumInt.pred(123.5), O.none)
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const EnumInt: Enum<number> = {
  ...BoundedSafe,
  succ: flow(
    O.fromPredicate(
      and((n: number) => n < Number.MAX_SAFE_INTEGER)(Number.isInteger),
    ),
    O.map(increment),
  ),
  pred: flow(
    O.fromPredicate(
      and((n: number) => n > Number.MIN_SAFE_INTEGER)(Number.isInteger),
    ),
    O.map(decrement),
  ),
  toEnum: O.some,
  fromEnum: identity,
  cardinality: L.of(Infinity),
}

/**
 * Returns the individual digits of a number.
 *
 * Non-numeric characters like `-`, `.`, and `_` are supported in the input and
 * will be removed.
 *
 * Values in non-decimal notations are implicitly converted to decimal notation
 * in JavaScript.
 *
 * An empty array is returned for values like `NaN` and `Infinity`.
 *
 * @example
 * import { digits } from 'fp-ts-std/Number'
 *
 * assert.deepStrictEqual(digits(123), [1, 2, 3])
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const digits = (n: number): Array<number> =>
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  pipe([...(n + "")], A.filterMap(fromString))
