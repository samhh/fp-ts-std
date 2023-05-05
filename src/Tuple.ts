/**
 * Various functions to aid in working with tuples.
 *
 * @since 0.12.0
 */

import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from "fp-ts/HKT"
import {
  Functor,
  Functor1,
  Functor2,
  Functor3,
  Functor4,
  Functor2C,
} from "fp-ts/Functor"
import * as Tuple from "fp-ts/Tuple"
import { fork } from "./Function"
import { flow, identity, pipe } from "fp-ts/function"
import { mapBoth as _mapBoth } from "./Bifunctor"
import { Eq, fromEquals } from "fp-ts/Eq"
import { Ord, fromCompare } from "fp-ts/Ord"
import { EQ } from "./Ordering"
import { Bounded } from "fp-ts/Bounded"
import { Enum } from "./Enum"
import * as L from "./Lazy"
import { isNonNegative, isValid, multiply } from "./Number"
import * as O from "fp-ts/Option"
import { allPass } from "./Predicate"

/**
 * Duplicate a value into a tuple.
 *
 * @example
 * import { dup } from 'fp-ts-std/Tuple'
 *
 * assert.deepStrictEqual(dup('x'), ['x', 'x'])
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const dup: <A>(x: A) => [A, A] = fork([identity, identity])

/**
 * Apply a function, collecting the output alongside the input. A dual to
 * `toSnd`.
 *
 * @example
 * import { toFst } from 'fp-ts-std/Tuple'
 * import { fromNumber } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(toFst(fromNumber)(5), ['5', 5])
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const toFst = <A, B>(f: (x: A) => B): ((x: A) => [B, A]) =>
  fork([f, identity])

/**
 * Apply a function, collecting the input alongside the output. A dual to
 * `toFst`.
 *
 * @example
 * import { toFst } from 'fp-ts-std/Tuple'
 * import { fromNumber } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(toFst(fromNumber)(5), ['5', 5])
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const toSnd = <A, B>(f: (x: A) => B): ((x: A) => [A, B]) =>
  fork([identity, f])

/**
 * Apply a functorial function, collecting the output alongside the input. A
 * dual to `traverseToSnd`.
 *
 * @example
 * import { traverseToFst } from 'fp-ts-std/Tuple'
 * import * as O from 'fp-ts/Option'
 * import { flow, constant } from 'fp-ts/function'
 * import { fromNumber } from 'fp-ts-std/String'
 *
 * const traverseToFstO = traverseToFst(O.Functor)
 * const fromNumberO = flow(fromNumber, O.some)
 *
 * assert.deepStrictEqual(traverseToFstO(fromNumberO)(5), O.some(['5', 5]))
 * assert.deepStrictEqual(traverseToFstO(constant(O.none))(5), O.none)
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export function traverseToFst<F extends URIS4>(
  F: Functor4<F>,
): <S, R, E, A, B>(
  g: (x: A) => Kind4<F, S, R, E, B>,
) => (x: A) => Kind4<F, S, R, E, [B, A]>
export function traverseToFst<F extends URIS3>(
  F: Functor3<F>,
): <R, E, A, B>(
  g: (x: A) => Kind3<F, R, E, B>,
) => (x: A) => Kind3<F, R, E, [B, A]>
export function traverseToFst<F extends URIS2>(
  F: Functor2<F>,
): <E, A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [B, A]>
export function traverseToFst<F extends URIS2, E>(
  F: Functor2C<F, E>,
): <A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [B, A]>
export function traverseToFst<F extends URIS>(
  F: Functor1<F>,
): <A, B>(g: (x: A) => Kind<F, B>) => (x: A) => Kind<F, [B, A]>
export function traverseToFst<F>(
  F: Functor<F>,
): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [B, A]>
export function traverseToFst<F>(
  F: Functor<F>,
): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [B, A]> {
  return g => x => F.map(g(x), y => [y, x])
}

/**
 * Apply a functorial function, collecting the input alongside the output. A
 * dual to `traverseToFst`.
 *
 * @example
 * import { traverseToSnd } from 'fp-ts-std/Tuple'
 * import * as O from 'fp-ts/Option'
 * import { flow, constant } from 'fp-ts/function'
 * import { fromNumber } from 'fp-ts-std/String'
 *
 * const traverseToSndO = traverseToSnd(O.Functor)
 * const fromNumberO = flow(fromNumber, O.some)
 *
 * assert.deepStrictEqual(traverseToSndO(fromNumberO)(5), O.some([5, '5']))
 * assert.deepStrictEqual(traverseToSndO(constant(O.none))(5), O.none)
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export function traverseToSnd<F extends URIS4>(
  F: Functor4<F>,
): <S, R, E, A, B>(
  g: (x: A) => Kind4<F, S, R, E, B>,
) => (x: A) => Kind4<F, S, R, E, [A, B]>
export function traverseToSnd<F extends URIS3>(
  F: Functor3<F>,
): <R, E, A, B>(
  g: (x: A) => Kind3<F, R, E, B>,
) => (x: A) => Kind3<F, R, E, [A, B]>
export function traverseToSnd<F extends URIS2>(
  F: Functor2<F>,
): <E, A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [A, B]>
export function traverseToSnd<F extends URIS2, E>(
  F: Functor2C<F, E>,
): <A, B>(g: (x: A) => Kind2<F, E, B>) => (x: A) => Kind2<F, E, [A, B]>
export function traverseToSnd<F extends URIS>(
  F: Functor1<F>,
): <A, B>(g: (x: A) => Kind<F, B>) => (x: A) => Kind<F, [A, B]>
export function traverseToSnd<F>(
  F: Functor<F>,
): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [A, B]>
export function traverseToSnd<F>(
  F: Functor<F>,
): <A, B>(g: (x: A) => HKT<F, B>) => (x: A) => HKT<F, [A, B]> {
  return g => x => F.map(g(x), y => [x, y])
}

/**
 * Curried tuple construction. A dual to `withSnd`. Equivalent to Haskell's
 * tuple sections.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { withFst } from 'fp-ts-std/Tuple'
 *
 * assert.deepStrictEqual(pipe('x', withFst('y')), ['y', 'x'])
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const withFst =
  <A>(x: A) =>
  <B>(y: B): [A, B] =>
    [x, y]

/**
 * Curried tuple construction. A dual to `withFst`. Equivalent to Haskell's
 * tuple sections.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { withSnd } from 'fp-ts-std/Tuple'
 *
 * assert.deepStrictEqual(pipe('x', withSnd('y')), ['x', 'y'])
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const withSnd =
  <A>(x: A) =>
  <B>(y: B): [B, A] =>
    [y, x]

/**
 * Create a tuple. Helps with fighting TypeScript's type inferrence without
 * having to repeat yourself or use `as const`.
 *
 * @example
 * import { create } from 'fp-ts-std/Tuple'
 *
 * assert.deepStrictEqual(create(['x', 'y']), ['x', 'y'])
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const create: <A, B>(xs: [A, B]) => [A, B] = identity

/**
 * Apply a function to both elements of a tuple.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { mapBoth } from 'fp-ts-std/Tuple'
 * import { multiply } from 'fp-ts-std/Number'
 *
 * const xs = pipe([3, 5], mapBoth(multiply(2)))
 *
 * assert.deepStrictEqual(xs, [6, 10])
 *
 * @category 2 Typeclass Methods
 * @since 0.14.0
 */
export const mapBoth: <A, B>(f: (x: A) => B) => (xs: [A, A]) => [B, B] =
  _mapBoth(Tuple.Bifunctor)

/**
 * Send an input to two functions and combine their outputs in a tuple. For a
 * variadic version, consider `fork` in `Function`.
 *
 * @example
 * import { fanout } from 'fp-ts-std/Tuple'
 * import { add } from 'fp-ts-std/Number'
 * import * as S from 'fp-ts-std/String'
 *
 * const add2 = add(2)
 *
 * assert.deepStrictEqual(fanout(S.fromNumber)(add2)(0), ['0', 2])
 *
 * @category 3 Functions
 * @since 0.15.0
 */
// Not implemented in terms of `fp-ts/Strong` as there's no relevant typeclass
// instances, and the implementation is very straightforward.
export const fanout: <A, B>(
  f: (x: A) => B,
) => <C>(g: (x: A) => C) => (x: A) => [B, C] = f => g => fork([f, g])

/**
 * Derive `Eq` for a tuple given `Eq` instances for its members.
 *
 * @example
 * import { getEq } from 'fp-ts-std/Tuple'
 * import * as Str from 'fp-ts/string'
 * import * as Num from 'fp-ts/number'
 *
 * const Eq = getEq(Str.Eq)(Num.Eq)
 *
 * assert.strictEqual(Eq.equals(['foo', 123], ['foo', 123]), true)
 * assert.strictEqual(Eq.equals(['foo', 123], ['bar', 123]), false)
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const getEq =
  <A>(EA: Eq<A>) =>
  <B>(EB: Eq<B>): Eq<[A, B]> =>
    fromEquals(([xa, xb], [ya, yb]) => EA.equals(xa, ya) && EB.equals(xb, yb))

/**
 * Derive `Ord` for a tuple given `Ord` instances for its members. The first
 * component is compared first.
 *
 * @example
 * import { getOrd } from 'fp-ts-std/Tuple'
 * import * as Str from 'fp-ts/string'
 * import * as Num from 'fp-ts/number'
 * import { LT, EQ, GT } from 'fp-ts-std/Ordering'
 *
 * const Ord = getOrd(Str.Ord)(Num.Ord)
 *
 * assert.strictEqual(Ord.compare(['foo', 123], ['foo', 123]), EQ)
 * assert.strictEqual(Ord.compare(['foo', 123], ['bar', 123]), GT)
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const getOrd =
  <A>(OA: Ord<A>) =>
  <B>(OB: Ord<B>): Ord<[A, B]> =>
    fromCompare(([xa, xb], [ya, yb]) => {
      const a = OA.compare(xa, ya)
      return a === EQ ? OB.compare(xb, yb) : a
    })

/**
 * Derive a `Bounded` instance for a tuple in which the top and bottom
 * bounds are `[A.top, B.top]` and `[A.bottom, B.bottom]` respectively.
 *
 * @example
 * import { getBounded } from 'fp-ts-std/Tuple'
 * import * as Bool from 'fp-ts-std/Boolean'
 *
 * assert.deepStrictEqual(
 *   getBounded(Bool.Bounded)(Bool.Bounded).top,
 *   [true, true],
 * )
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const getBounded =
  <A>(BA: Bounded<A>) =>
  <B>(BB: Bounded<B>): Bounded<[A, B]> => ({
    ...getOrd(BA)(BB),
    top: [BA.top, BB.top],
    bottom: [BA.bottom, BB.bottom],
  })

/**
 * Derive an `Enum` instance for a tuple given an `Enum` instance for each
 * member.
 *
 * @example
 * import { universe } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 * import { getEnum } from 'fp-ts-std/Tuple'
 *
 * const E = getEnum(EnumBool)(EnumBool)
 *
 * assert.deepStrictEqual(
 *   universe(E),
 *   [[false, false], [true, false], [false, true], [true, true]],
 * )
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const getEnum =
  <A>(EA: Enum<A>) =>
  <B>(EB: Enum<B>): Enum<[A, B]> => ({
    ...getBounded(EA)(EB),
    succ: ([a, b]) =>
      EA.equals(a, EA.top)
        ? pipe(EB.succ(b), O.map(withFst(EA.bottom)))
        : pipe(EA.succ(a), O.map(withSnd(b))),
    pred: ([a, b]) =>
      EA.equals(a, EA.bottom)
        ? pipe(EB.pred(b), O.map(withFst(EA.top)))
        : pipe(EA.pred(a), O.map(withSnd(b))),
    toEnum: flow(
      O.fromPredicate(allPass([isValid, isNonNegative, Number.isInteger])),
      O.chain(n => {
        const ac = L.execute(EA.cardinality)
        const bc = L.execute(EB.cardinality)
        if (n > ac + bc) return O.none // eslint-disable-line functional/no-conditional-statements

        type AB = (x: A) => (y: B) => [A, B]
        return pipe(
          O.of<AB>(withFst),
          O.ap(EA.toEnum(n % ac)),
          O.ap(EB.toEnum(Math.floor(n / ac))),
        )
      }),
    ),
    fromEnum: ([a, b]) => {
      const ai = EA.fromEnum(a)
      const bi = EB.fromEnum(b)
      const ac = L.execute(EA.cardinality)
      return (ac - 1) * bi + ai + bi
    },
    cardinality: pipe(
      L.of(multiply),
      L.ap(EA.cardinality),
      L.ap(EB.cardinality),
    ),
  })
