/**
 * Utility functions to accommodate `fp-ts/Monad`.
 *
 * @since 0.15.0
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
  Monad,
  Monad1,
  Monad2,
  Monad2C,
  Monad3,
  Monad3C,
  Monad4,
} from "fp-ts/Monad"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import { invert } from "./Boolean.js"
import { Predicate } from "fp-ts/Predicate"

/**
 * Monadic if/then/else. Only executes the relevant action.
 *
 * @example
 * import { ifM } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import { execute } from 'fp-ts-std/IO'
 *
 * const f =
 *   ifM(IO.Monad)(IO.of(true))
 *     (IO.of('foo'))(IO.of('bar'))
 *
 * assert.strictEqual(execute(f), 'foo')
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export function ifM<M extends URIS4>(
  M: Monad4<M>,
): <S, R, E>(
  p: Kind4<M, S, R, E, boolean>,
) => <A>(
  x: Kind4<M, S, R, E, A>,
) => (y: Kind4<M, S, R, E, A>) => Kind4<M, S, R, E, A>
export function ifM<M extends URIS3>(
  M: Monad3<M>,
): <R, E>(
  p: Kind3<M, R, E, boolean>,
) => <A>(x: Kind3<M, R, E, A>) => (y: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export function ifM<M extends URIS3, E>(
  M: Monad3C<M, E>,
): <R>(
  p: Kind3<M, R, E, boolean>,
) => <A>(x: Kind3<M, R, E, A>) => (y: Kind3<M, R, E, A>) => Kind3<M, R, E, A>
export function ifM<M extends URIS2>(
  M: Monad2<M>,
): <E>(
  p: Kind2<M, E, boolean>,
) => <A>(x: Kind2<M, E, A>) => (y: Kind2<M, E, A>) => Kind2<M, E, A>
export function ifM<M extends URIS2, E>(
  M: Monad2C<M, E>,
): (
  p: Kind2<M, E, boolean>,
) => <A>(x: Kind2<M, E, A>) => (y: Kind2<M, E, A>) => Kind2<M, E, A>
export function ifM<M extends URIS>(
  M: Monad1<M>,
): (p: Kind<M, boolean>) => <A>(x: Kind<M, A>) => (y: Kind<M, A>) => Kind<M, A>
export function ifM<M>(
  M: Monad<M>,
): (p: HKT<M, boolean>) => <A>(x: HKT<M, A>) => (y: HKT<M, A>) => HKT<M, A> {
  return p => x => y => M.chain(p, b => (b ? x : y))
}

/**
 * Monadic &&. Short-circuits.
 *
 * @example
 * import { andM } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import { execute } from 'fp-ts-std/IO'
 *
 * const f = andM(IO.Monad)(IO.of(true))
 *
 * assert.strictEqual(execute(f(IO.of(true))), true)
 * assert.strictEqual(execute(f(IO.of(false))), false)
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export function andM<M extends URIS4>(
  M: Monad4<M>,
): <S, R, E>(
  x: Kind4<M, S, R, E, boolean>,
) => (y: Kind4<M, S, R, E, boolean>) => Kind4<M, S, R, E, boolean>
export function andM<M extends URIS3>(
  M: Monad3<M>,
): <R, E>(
  x: Kind3<M, R, E, boolean>,
) => (y: Kind3<M, R, E, boolean>) => Kind3<M, R, E, boolean>
export function andM<M extends URIS3, E>(
  M: Monad3C<M, E>,
): <R>(
  x: Kind3<M, R, E, boolean>,
) => (y: Kind3<M, R, E, boolean>) => Kind3<M, R, E, boolean>
export function andM<M extends URIS2>(
  M: Monad2<M>,
): <E>(
  x: Kind2<M, E, boolean>,
) => (y: Kind2<M, E, boolean>) => Kind2<M, E, boolean>
export function andM<M extends URIS2, E>(
  M: Monad2C<M, E>,
): (
  x: Kind2<M, E, boolean>,
) => (y: Kind2<M, E, boolean>) => Kind2<M, E, boolean>
export function andM<M extends URIS>(
  M: Monad1<M>,
): (x: Kind<M, boolean>) => (y: Kind<M, boolean>) => Kind<M, boolean>
export function andM<M>(
  M: Monad<M>,
): (x: HKT<M, boolean>) => (y: HKT<M, boolean>) => HKT<M, boolean> {
  // Can't reuse `ifM` here, unsure why:
  //   ifM(M)(x)(y)(M.of(false))
  return x => y => M.chain(x, b => (b ? y : M.of(false)))
}

/**
 * Monadic ||. Short-circuits.
 *
 * @example
 * import { orM } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import { execute } from 'fp-ts-std/IO'
 *
 * const f = orM(IO.Monad)(IO.of(false))
 *
 * assert.strictEqual(execute(f(IO.of(true))), true)
 * assert.strictEqual(execute(f(IO.of(false))), false)
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export function orM<M extends URIS4>(
  M: Monad4<M>,
): <S, R, E>(
  x: Kind4<M, S, R, E, boolean>,
) => (y: Kind4<M, S, R, E, boolean>) => Kind4<M, S, R, E, boolean>
export function orM<M extends URIS3>(
  M: Monad3<M>,
): <R, E>(
  x: Kind3<M, R, E, boolean>,
) => (y: Kind3<M, R, E, boolean>) => Kind3<M, R, E, boolean>
export function orM<M extends URIS3, E>(
  M: Monad3C<M, E>,
): <R>(
  x: Kind3<M, R, E, boolean>,
) => (y: Kind3<M, R, E, boolean>) => Kind3<M, R, E, boolean>
export function orM<M extends URIS2>(
  M: Monad2<M>,
): <E>(
  x: Kind2<M, E, boolean>,
) => (y: Kind2<M, E, boolean>) => Kind2<M, E, boolean>
export function orM<M extends URIS2, E>(
  M: Monad2C<M, E>,
): (
  x: Kind2<M, E, boolean>,
) => (y: Kind2<M, E, boolean>) => Kind2<M, E, boolean>
export function orM<M extends URIS>(
  M: Monad1<M>,
): (x: Kind<M, boolean>) => (y: Kind<M, boolean>) => Kind<M, boolean>
export function orM<M>(
  M: Monad<M>,
): (x: HKT<M, boolean>) => (y: HKT<M, boolean>) => HKT<M, boolean> {
  // Can't reuse `ifM` here, unsure why:
  //   ifM(M)(x)(M.of(true))(y)
  return x => y => M.chain(x, b => (b ? M.of(true) : y))
}

/**
 * Monadic `allPass`. Short-circuits.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { allPassM } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import { execute } from 'fp-ts-std/IO'
 *
 * const f = allPassM(IO.Monad)
 *
 * assert.strictEqual(execute(f([constant(IO.of(true)), constant(IO.of(true))])('foo')), true)
 * assert.strictEqual(execute(f([constant(IO.of(true)), constant(IO.of(false))])('foo')), false)
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export function allPassM<M extends URIS4>(
  M: Monad4<M>,
): <S, R, E, A>(
  f: Array<(x: A) => Kind4<M, S, R, E, boolean>>,
) => (x: A) => Kind4<M, S, R, E, boolean>
export function allPassM<M extends URIS3>(
  M: Monad3<M>,
): <R, E, A>(
  f: Array<(x: A) => Kind3<M, R, E, boolean>>,
) => (x: A) => Kind3<M, R, E, boolean>
export function allPassM<M extends URIS3, E>(
  M: Monad3C<M, E>,
): <R, A>(
  f: Array<(x: A) => Kind3<M, R, E, boolean>>,
) => (x: A) => Kind3<M, R, E, boolean>
export function allPassM<M extends URIS2>(
  M: Monad2<M>,
): <E, A>(
  f: Array<(x: A) => Kind2<M, E, boolean>>,
) => (x: A) => Kind2<M, E, boolean>
export function allPassM<M extends URIS2, E>(
  M: Monad2C<M, E>,
): <A>(
  f: Array<(x: A) => Kind2<M, E, boolean>>,
) => (x: A) => Kind2<M, E, boolean>
export function allPassM<M extends URIS>(
  M: Monad1<M>,
): <A>(f: Array<(x: A) => Kind<M, boolean>>) => (x: A) => Kind<M, boolean>
export function allPassM<M>(
  M: Monad<M>,
): <A>(f: Array<(x: A) => HKT<M, boolean>>) => (x: A) => HKT<M, boolean> {
  return fs => x =>
    pipe(
      fs,
      A.reduce(M.of(true), (m, f) => M.chain(m, b => (b ? f(x) : M.of(false)))),
    )
}

/**
 * Monadic `anyPass`. Short-circuits.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { anyPassM } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import { execute } from 'fp-ts-std/IO'
 *
 * const f = anyPassM(IO.Monad)
 *
 * assert.strictEqual(execute(f([constant(IO.of(true)), constant(IO.of(false))])('foo')), true)
 * assert.strictEqual(execute(f([constant(IO.of(false)), constant(IO.of(false))])('foo')), false)
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export function anyPassM<M extends URIS4>(
  M: Monad4<M>,
): <S, R, E, A>(
  f: Array<(x: A) => Kind4<M, S, R, E, boolean>>,
) => (x: A) => Kind4<M, S, R, E, boolean>
export function anyPassM<M extends URIS3>(
  M: Monad3<M>,
): <R, E, A>(
  f: Array<(x: A) => Kind3<M, R, E, boolean>>,
) => (x: A) => Kind3<M, R, E, boolean>
export function anyPassM<M extends URIS3, E>(
  M: Monad3C<M, E>,
): <R, A>(
  f: Array<(x: A) => Kind3<M, R, E, boolean>>,
) => (x: A) => Kind3<M, R, E, boolean>
export function anyPassM<M extends URIS2>(
  M: Monad2<M>,
): <E, A>(
  f: Array<(x: A) => Kind2<M, E, boolean>>,
) => (x: A) => Kind2<M, E, boolean>
export function anyPassM<M extends URIS2, E>(
  M: Monad2C<M, E>,
): <A>(
  f: Array<(x: A) => Kind2<M, E, boolean>>,
) => (x: A) => Kind2<M, E, boolean>
export function anyPassM<M extends URIS>(
  M: Monad1<M>,
): <A>(f: Array<(x: A) => Kind<M, boolean>>) => (x: A) => Kind<M, boolean>
export function anyPassM<M>(
  M: Monad<M>,
): <A>(f: Array<(x: A) => HKT<M, boolean>>) => (x: A) => HKT<M, boolean> {
  return fs => x =>
    pipe(
      fs,
      A.reduce(M.of(false), (m, f) => M.chain(m, b => (b ? M.of(true) : f(x)))),
    )
}

/**
 * Monadic `nonePass`. Short-circuits.
 *
 * @example
 * import { constant } from 'fp-ts/function'
 * import { nonePassM } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import { execute } from 'fp-ts-std/IO'
 *
 * const f = nonePassM(IO.Monad)
 *
 * assert.strictEqual(execute(f([constant(IO.of(false)), constant(IO.of(false))])('foo')), true)
 * assert.strictEqual(execute(f([constant(IO.of(false)), constant(IO.of(true))])('foo')), false)
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export function nonePassM<M extends URIS4>(
  M: Monad4<M>,
): <S, R, E, A>(
  f: Array<(x: A) => Kind4<M, S, R, E, boolean>>,
) => (x: A) => Kind4<M, S, R, E, boolean>
export function nonePassM<M extends URIS3>(
  M: Monad3<M>,
): <R, E, A>(
  f: Array<(x: A) => Kind3<M, R, E, boolean>>,
) => (x: A) => Kind3<M, R, E, boolean>
export function nonePassM<M extends URIS3, E>(
  M: Monad3C<M, E>,
): <R, A>(
  f: Array<(x: A) => Kind3<M, R, E, boolean>>,
) => (x: A) => Kind3<M, R, E, boolean>
export function nonePassM<M extends URIS2>(
  M: Monad2<M>,
): <E, A>(
  f: Array<(x: A) => Kind2<M, E, boolean>>,
) => (x: A) => Kind2<M, E, boolean>
export function nonePassM<M extends URIS2, E>(
  M: Monad2C<M, E>,
): <A>(
  f: Array<(x: A) => Kind2<M, E, boolean>>,
) => (x: A) => Kind2<M, E, boolean>
export function nonePassM<M extends URIS>(
  M: Monad1<M>,
): <A>(f: Array<(x: A) => Kind<M, boolean>>) => (x: A) => Kind<M, boolean>
export function nonePassM<M>(
  M: Monad<M>,
): <A>(f: Array<(x: A) => HKT<M, boolean>>) => (x: A) => HKT<M, boolean> {
  return fs => x =>
    pipe(
      fs,
      A.reduce(M.of(true), (m, f) =>
        M.chain(m, b => (b ? M.map(f(x), invert) : M.of(false))),
      ),
    )
}

/**
 * Like applicative `when`, but the condition is monadic.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { whenM } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import * as IOE from 'fp-ts/IOEither'
 * import { log } from 'fp-ts/Console'
 *
 * const isInvalid = (n: number): IO.IO<boolean> => () => Date.now() !== 42
 *
 * pipe(
 *   IOE.of(123),
 *   IOE.chainFirstIOK(n =>
 *     whenM(IO.Monad)(isInvalid(n))(log(n))),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.16.0
 */
export function whenM<F extends URIS4>(
  M: Monad4<F>,
): <S, R, E>(
  b: Kind4<F, S, R, E, boolean>,
) => (x: Kind4<F, S, R, E, void>) => Kind4<F, S, R, E, void>
export function whenM<F extends URIS3>(
  M: Monad3<F>,
): <R, E>(
  b: Kind3<F, R, E, boolean>,
) => (x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export function whenM<F extends URIS3, E>(
  M: Monad3C<F, E>,
): <R>(
  b: Kind3<F, R, E, boolean>,
) => (x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export function whenM<F extends URIS2>(
  M: Monad2<F>,
): <E>(b: Kind2<F, E, boolean>) => (x: Kind2<F, E, void>) => Kind2<F, E, void>
export function whenM<F extends URIS2, E>(
  M: Monad2C<F, E>,
): (b: Kind2<F, E, boolean>) => (x: Kind2<F, E, void>) => Kind2<F, E, void>
export function whenM<F extends URIS>(
  M: Monad1<F>,
): (b: Kind<F, boolean>) => (x: Kind<F, void>) => Kind<F, void>
export function whenM<F>(
  M: Monad<F>,
): (b: HKT<F, boolean>) => (x: HKT<F, void>) => HKT<F, void> {
  return b => x => M.chain(b, bb => (bb ? x : M.of(undefined)))
}

/**
 * The reverse of `whenM`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { unlessM } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import * as IOE from 'fp-ts/IOEither'
 * import { log } from 'fp-ts/Console'
 *
 * const isValid = (n: number): IO.IO<boolean> => () => Date.now() === 42
 *
 * pipe(
 *   IOE.of(123),
 *   IOE.chainFirstIOK(n =>
 *     unlessM(IO.Monad)(isValid(n))(log(n))),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.16.0
 */
export function unlessM<F extends URIS4>(
  M: Monad4<F>,
): <S, R, E>(
  b: Kind4<F, S, R, E, boolean>,
) => (x: Kind4<F, S, R, E, void>) => Kind4<F, S, R, E, void>
export function unlessM<F extends URIS3>(
  M: Monad3<F>,
): <R, E>(
  b: Kind3<F, R, E, boolean>,
) => (x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export function unlessM<F extends URIS3, E>(
  M: Monad3C<F, E>,
): <R>(
  b: Kind3<F, R, E, boolean>,
) => (x: Kind3<F, R, E, void>) => Kind3<F, R, E, void>
export function unlessM<F extends URIS2>(
  M: Monad2<F>,
): <E>(b: Kind2<F, E, boolean>) => (x: Kind2<F, E, void>) => Kind2<F, E, void>
export function unlessM<F extends URIS2, E>(
  M: Monad2C<F, E>,
): (b: Kind2<F, E, boolean>) => (x: Kind2<F, E, void>) => Kind2<F, E, void>
export function unlessM<F extends URIS>(
  M: Monad1<F>,
): (b: Kind<F, boolean>) => (x: Kind<F, void>) => Kind<F, void>
export function unlessM<F>(
  M: Monad<F>,
): (b: HKT<F, boolean>) => (x: HKT<F, void>) => HKT<F, void> {
  return b => x => M.chain(b, bb => (bb ? M.of(undefined) : x))
}

/**
 * Repeatedly execute an action until the result satisfies the predicate.
 *
 * @example
 * import { until } from 'fp-ts-std/Monad'
 * import * as IO from 'fp-ts/IO'
 * import { execute } from 'fp-ts-std/IO'
 * import { Predicate } from 'fp-ts/Predicate'
 * import * as Rand from 'fp-ts/Random'
 *
 * const isValid: Predicate<number> = n => n > 0.5
 *
 * const genValid: IO.IO<number> = until(IO.Monad)(isValid)(Rand.random)
 *
 * assert.strictEqual(
 *   isValid(execute(genValid)),
 *   true,
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.18.0
 */
export function until<F extends URIS4>(
  M: Monad4<F>,
): <S, R, E, A>(
  p: Predicate<A>,
) => (x: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, A>
export function until<F extends URIS3>(
  M: Monad3<F>,
): <R, E, A>(p: Predicate<A>) => (x: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
export function until<F extends URIS3, E>(
  M: Monad3C<F, E>,
): <R, A>(p: Predicate<A>) => (x: Kind3<F, R, E, A>) => Kind3<F, R, E, A>
export function until<F extends URIS2>(
  M: Monad2<F>,
): <E, A>(p: Predicate<A>) => (x: Kind2<F, E, A>) => Kind2<F, E, A>
export function until<F extends URIS2, E>(
  M: Monad2C<F, E>,
): <A>(p: Predicate<A>) => (x: Kind2<F, E, A>) => Kind2<F, E, A>
export function until<F extends URIS>(
  M: Monad1<F>,
): <A>(p: Predicate<A>) => (x: Kind<F, A>) => Kind<F, A>
export function until<F>(M: Monad<F>) {
  return <A>(p: Predicate<A>) =>
    (x: HKT<F, A>): HKT<F, A> => {
      const go: HKT<F, A> = M.chain(x, y => (p(y) ? M.of<A>(y) : go))

      return go
    }
}
