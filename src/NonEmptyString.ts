/**
 * A newtype around strings signifying non-emptiness therein.
 *
 * Many further utilities can be defined in terms of the `String` module via
 * contramap, for example any predicates.
 *
 * @since 0.15.0
 */

import { flow } from "fp-ts/lib/function.js"
import { Newtype, getEq, getOrd, getSemigroup } from "newtype-ts/lib/index.js"
import * as O from "fp-ts/lib/Option.js"
import { unsafeExpect, unsafeUnwrap } from "./Option.js"
import {
  Show as _Show,
  Eq as _Eq,
  Ord as _Ord,
  Semigroup as _Semigroup,
  toUpperCase as _toUpperCase,
  toLowerCase as _toLowerCase,
  isEmpty as _isEmpty,
  size as _size,
  includes as _includes,
  split as _split,
} from "fp-ts/lib/string.js"
import * as Str from "./String.js"
import { pack, unpack, over } from "./Newtype.js"
import { Predicate, not } from "fp-ts/lib/Predicate.js"
import { Endomorphism } from "fp-ts/lib/Endomorphism.js"
import type { Show as TShow } from "fp-ts/lib/Show.js"
import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray.js"

type Show<A> = TShow<A>

type NonEmptyStringSymbol = { readonly NonEmptyString: unique symbol }

/**
 * Newtype representing a non-empty string. Non-emptiness is only guaranteed so
 * long as interaction with the newtype is confined to exports from this module,
 * as unlike `NonEmptyArray` it's only protected by a smart constructor.
 *
 * @example
 * import { NonEmptyString, unsafeFromString } from 'fp-ts-std/NonEmptyString'
 * import * as O from 'fp-ts/Option'
 *
 * const signature: NonEmptyString = unsafeFromString('- @samhh.com')
 *
 * @category 0 Types
 * @since 0.15.0
 */
export type NonEmptyString = Newtype<NonEmptyStringSymbol, string>

/**
 * Smart constructor from strings.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const fromString: (x: string) => O.Option<NonEmptyString> = flow(
  O.fromPredicate(not(_isEmpty)),
  O.map(pack<NonEmptyString>),
)

/**
 * Unsafely lift a string to `NonEmptyString`, throwing upon failure. Can be
 * useful for static values. Try to use `fromString` instead.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const unsafeFromString: (x: string) => NonEmptyString = flow(
  fromString,
  unsafeExpect("Failed to lift an empty string to NonEmptyString"),
)

/**
 * Safely derive a `NonEmptyString` from any number.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const fromNumber: (x: number) => NonEmptyString = flow(
  Str.fromNumber,
  unsafeFromString,
)

/**
 * Unwrap a `NonEmptyString` newtype back to its underlying string
 * representation.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const unNonEmptyString: (x: NonEmptyString) => string = unpack

/**
 * An alias of `unNonEmptyString`.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const toString: (x: NonEmptyString) => string = unNonEmptyString

/**
 * `Eq` instance for `NonEmptyString` for testing equivalence.
 *
 * @category 1 Typeclass Instances
 * @since 0.15.0
 */
export const Eq = getEq<NonEmptyString>(_Eq)

/**
 * `Ord` instance for `NonEmptyString` for comparison.
 *
 * @category 1 Typeclass Instances
 * @since 0.15.0
 */
export const Ord = getOrd<NonEmptyString>(_Ord)

/**
 * `Semigroup` instance for `NonEmptyString`, enabling concatenation.
 *
 * @category 1 Typeclass Instances
 * @since 0.15.0
 */
export const Semigroup = getSemigroup<NonEmptyString>(_Semigroup)

/**
 * `Show` instance for `NonEmptyString`.
 *
 * @category 1 Typeclass Instances
 * @since 0.15.0
 */
export const Show: Show<NonEmptyString> = {
  show: flow(unNonEmptyString, _Show.show),
}

/**
 * Get the first character in a `NonEmptyString`.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const head: Endomorphism<NonEmptyString> = over(
  flow(Str.head, unsafeUnwrap),
)

/**
 * Get the last character in a `NonEmptyString`.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const last: Endomorphism<NonEmptyString> = over(
  flow(Str.last, unsafeUnwrap),
)

/**
 * Convert a `NonEmptyString` to uppercase.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const toUpperCase: Endomorphism<NonEmptyString> = over(_toUpperCase)

/**
 * Convert a `NonEmptyString` to lowercase.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const toLowerCase: Endomorphism<NonEmptyString> = over(_toLowerCase)

/**
 * Prepend a string to a `NonEmptyString`.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const prepend: (x: string) => Endomorphism<NonEmptyString> = flow(
  Str.prepend,
  over,
)

/**
 * Append a string to a `NonEmptyString`.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const append: (x: string) => Endomorphism<NonEmptyString> = flow(
  Str.append,
  over,
)

/**
 * Surround a `NonEmptyString`. Equivalent to calling `prepend` and `append`
 * with the same outer value.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const surround: (x: string) => Endomorphism<NonEmptyString> = flow(
  Str.surround,
  over,
)

/**
 * Reverse a `NonEmptyString`.
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const reverse: Endomorphism<NonEmptyString> = over(Str.reverse)

/**
 * Calculate the number of characters in a `NonEmptyString`.
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const size: (x: NonEmptyString) => number = flow(toString, _size)

/**
 * Split a `NonEmptyString` into an array of strings using `separator`.
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const split = (
  separator: string | RegExp,
): ((x: NonEmptyString) => ReadonlyNonEmptyArray<string>) =>
  flow(toString, _split(separator))

/**
 * Predicate upon the presence of a `search` string anywhere in a
 * `NonEmptyString`.
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const includes = (search: string): Predicate<NonEmptyString> =>
  flow(toString, _includes(search))
