/**
 * Utility functions to accommodate `fp-ts/Option`.
 *
 * @since 0.1.0
 */

import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { Eq } from "fp-ts/Eq"
import { Endomorphism } from "fp-ts/Endomorphism"
import { constant, flow, pipe } from "fp-ts/function"
import * as B from "fp-ts/boolean"
import { invert as invertBool } from "./Boolean"
import { altAllBy as _altAllBy, pureIf as _pureIf } from "./Alternative"
import { toMonoid as _toMonoid } from "./Monoid"
import * as L from "./Lazy"
import Lazy = L.Lazy
import { Ord } from "fp-ts/Ord"
import { Bounded } from "fp-ts/Bounded"
import { Enum } from "./Enum"
import { increment, decrement } from "./Number"

/**
 * Unwrap the value from within an `Option`, throwing `msg` if `None`.
 *
 * @example
 * import { unsafeExpect } from 'fp-ts-std/Option'
 * import * as O from 'fp-ts/Option'
 *
 * assert.throws(
 *   () => unsafeExpect('foo')(O.none),
 *   /^foo$/,
 * )
 *
 * @since 0.16.0
 */
export const unsafeExpect =
  (msg: string) =>
  <A>(x: Option<A>): A => {
    // eslint-disable-next-line functional/no-conditional-statements, functional/no-throw-statements
    if (O.isNone(x)) throw msg

    return x.value
  }

/**
 * Unwrap the value from within an `Option`, throwing if `None`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/Option'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(unsafeUnwrap(O.some(5)), 5)
 *
 * @since 0.1.0
 */
export const unsafeUnwrap: <A>(x: Option<A>) => A = unsafeExpect(
  "Unsafe attempt to unwrap Option failed",
)

/**
 * A thunked `None` constructor. Enables specifying the type of the `Option`
 * without a type assertion. Helpful in certain circumstances in which type
 * inferrence isn't smart enough to unify with the `Option<never>` of the
 * standard `None` constructor.
 *
 * @example
 * import { noneAs } from 'fp-ts-std/Option'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(noneAs<any>(), O.none)
 *
 * @since 0.12.0
 */
export const noneAs = <A>(): Option<A> => O.none

/**
 * Given an unwrapped value and an associated `Eq` instance for determining
 * equivalence, inverts an `Option` that may contain the same value, something
 * else, or nothing.
 *
 * This can be useful for circumstances in which you want to in a sense toggle
 * an `Option` value.
 *
 * @example
 * import { invert } from 'fp-ts-std/Option'
 * import * as O from 'fp-ts/Option'
 * import * as S from 'fp-ts/string'
 *
 * const f = invert(S.Eq)('x')
 *
 * assert.deepStrictEqual(f(O.none), O.some('x'))
 * assert.deepStrictEqual(f(O.some('y')), O.some('x'))
 * assert.deepStrictEqual(f(O.some('x')), O.none)
 *
 * @since 0.12.0
 */
export const invert =
  <A>(eq: Eq<A>) =>
  (val: A): Endomorphism<O.Option<A>> =>
    flow(
      O.exists(x => eq.equals(x, val)),
      B.match(() => O.some(val), constant(O.none)),
    )

/**
 * Extracts monoidal identity if `None`.
 *
 * @example
 * import { toMonoid } from 'fp-ts-std/Option'
 * import * as O from 'fp-ts/Option'
 * import * as Str from 'fp-ts/string'
 *
 * const f = toMonoid(Str.Monoid)
 *
 * assert.deepStrictEqual(f(O.some('x')), 'x')
 * assert.deepStrictEqual(f(O.none), '')
 *
 * @since 0.12.0
 */
export const toMonoid = _toMonoid(O.Foldable)

// These aren't defined in terms of Monoid memptyWhen/Unless because then we'd
// need a redundant `Monoid<A>` input.
/**
 * Conditionally returns the provided `Option` or `None`. The dual to
 * `memptyUnless`. The lazy value is evaluated only if the condition passes.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { memptyWhen } from 'fp-ts-std/Option'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(memptyWhen(true)(constant(O.some('x'))), O.none)
 * assert.deepStrictEqual(memptyWhen(true)(constant(O.none)), O.none)
 * assert.deepStrictEqual(memptyWhen(false)(constant(O.some('x'))), O.some('x'))
 * assert.deepStrictEqual(memptyWhen(false)(constant(O.none)), O.none)
 *
 * @since 0.13.0
 */
export const memptyWhen =
  (x: boolean) =>
  <A>(m: Lazy<Option<A>>): Option<A> =>
    x ? O.none : m()

/**
 * Conditionally returns the provided `Option` or `None`. The dual to
 * `memptyWhen`. The lazy value is evaluated only if the condition passes.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { memptyUnless } from 'fp-ts-std/Option'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(memptyUnless(true)(constant(O.some('x'))), O.some('x'))
 * assert.deepStrictEqual(memptyUnless(true)(constant(O.none)), O.none)
 * assert.deepStrictEqual(memptyUnless(false)(constant(O.some('x'))), O.none)
 * assert.deepStrictEqual(memptyUnless(false)(constant(O.none)), O.none)
 *
 * @since 0.13.0
 */
export const memptyUnless: (
  x: boolean,
) => <A>(m: Lazy<Option<A>>) => Option<A> = flow(invertBool, memptyWhen)

/**
 * Conditionally lifts a value to `Some` or returns `None`. The lazy value is
 * evaluated only if the condition passes.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { pureIf } from 'fp-ts-std/Option'
 * import { Predicate } from 'fp-ts/Predicate'
 *
 * const person = { name: 'Hodor', age: 40 }
 * const isMagicNumber: Predicate<number> = n => n === 42
 *
 * const mname = pureIf(isMagicNumber(person.age))(constant(person.name))
 *
 * @since 0.13.0
 */
export const pureIf: (x: boolean) => <A>(y: Lazy<A>) => Option<A> = _pureIf(
  O.Alternative,
)

/**
 * Like `altAll`, but flaps an input across an array of functions to produce
 * the `Option` values, short-circuiting upon a non-empty value. Useful given
 * `Option`'s eagerness.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { altAllBy } from 'fp-ts-std/Option'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   altAllBy([constant(O.none), O.some])('foo'),
 *   O.some('foo'),
 * )
 *
 * @since 0.15.0
 */
export const altAllBy: <A, B>(
  fs: Array<(x: A) => Option<B>>,
) => (x: A) => Option<B> = _altAllBy(O.Alternative)

/**
 * Derive a `Bounded` instance for `Option<A>` in which the top and bottom
 * bounds are `Some(B.top)` and `None` respectively.
 *
 * @since 0.17.0
 */
export const getBounded = <A>(B: Bounded<A>): Bounded<Option<A>> => ({
  ...O.getOrd(B),
  top: O.some(B.top),
  bottom: O.none,
})

/**
 * Derive an `Enum` instance for `Option<A>` given an `Enum` instance for `A`.
 *
 * @example
 * import { universe } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 * import * as O from 'fp-ts/Option'
 * import { getEnum as getEnumO } from 'fp-ts-std/Option'
 *
 * const EnumBoolO = getEnumO(EnumBool)
 *
 * assert.deepStrictEqual(
 *   universe(EnumBoolO),
 *   [O.none, O.some(false), O.some(true)],
 * )
 *
 * @since 0.17.0
 */
export const getEnum = <A>(E: Enum<A>): Enum<Option<A>> => ({
  ...getBounded(E),
  succ: O.match(
    L.lazy(() => O.some(O.some(E.bottom))),
    flow(E.succ, O.map(O.some)),
  ),
  pred: O.map(E.pred),
  toEnum: n =>
    n === 0 ? O.some(O.none) : pipe(n, decrement, E.toEnum, O.map(O.some)),
  fromEnum: O.match(constant(0), flow(E.fromEnum, increment)),
  cardinality: pipe(E.cardinality, L.map(increment)),
})

/**
 * Pattern match against two `Option`s simultaneously.
 *
 * @example
 * import { constant, flow } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 * import Option = O.Option
 * import { match2 } from 'fp-ts-std/Option'
 * import * as Str from 'fp-ts-std/String'
 *
 * const f: (x: Option<string>) => (y: Option<number>) => string = match2(
 *   constant('Who are you?'),
 *   Str.prepend('Your name is '),
 *   flow(Str.fromNumber, Str.prepend('Your age is ')),
 *   name => age => `You are ${name}, ${age}`,
 * )
 *
 * assert.strictEqual(f(O.none)(O.some(40)), 'Your age is 40')
 * assert.strictEqual(f(O.some("Hodor"))(O.some(40)), 'You are Hodor, 40')
 *
 * @since 0.17.0
 */
export const match2 =
  <A, B, C>(
    onNone: Lazy<C>,
    onSomeFst: (x: A) => C,
    onSomeSnd: (x: B) => C,
    onSomeBoth: (x: A) => (y: B) => C,
  ) =>
  (mx: Option<A>) =>
  (my: Option<B>): C =>
    pipe(
      mx,
      O.match(
        L.lazy(() => pipe(my, O.match(onNone, onSomeSnd))),
        x =>
          pipe(
            my,
            O.match(
              L.lazy(() => onSomeFst(x)),
              // eslint-disable-next-line functional/prefer-tacit
              y => onSomeBoth(x)(y),
            ),
          ),
      ),
    )
