/**
 * Utility functions to accommodate `fp-ts/IO`.
 *
 * @since 0.7.0
 */

import * as IO from "fp-ts/IO"
import { Endomorphism } from "fp-ts/Endomorphism"
import { Predicate } from "fp-ts/Predicate"
import { when as _when, unless as _unless } from "./Applicative"
import { constVoid, flow } from "fp-ts/function"

type IO<A> = IO.IO<A>

/**
 * Given a function, returns a new function that always returns the output
 * value of its first invocation.
 *
 * @example
 * import { once } from 'fp-ts-std/IO'
 * import * as IO from 'fp-ts/IO'
 * import { add } from 'fp-ts-std/Number'
 *
 * const f = once(add(5))
 *
 * assert.strictEqual(f(2)(), 7)
 * assert.strictEqual(f(3)(), 7)
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const once = <A, B>(f: (x: A) => B): ((x: A) => IO<B>) => {
  const uncalled = Symbol()
  let val: typeof uncalled | B = uncalled // eslint-disable-line functional/no-let

  return x => {
    // eslint-disable-next-line functional/no-conditional-statements
    if (val === uncalled) val = f(x) // eslint-disable-line functional/no-expression-statements

    return IO.of(val)
  }
}

/**
 * Applies an effectful function when the predicate against the invocation
 * count passes.
 *
 * The invocation count will continue to increment and the predicate will
 * continue to be checked on future invocations even after the predicate fails.
 *
 * Invocations start at the number one.
 *
 * @example
 * import { IO } from 'fp-ts/IO'
 * import { Predicate } from 'fp-ts/Predicate'
 * import { whenInvocationCount } from 'fp-ts-std/IO'
 *
 * const isUnderThree: Predicate<number> = n => n < 3
 *
 * let n = 0
 * const increment: IO<void> = () => { n++ }
 *
 * const f = whenInvocationCount(isUnderThree)(increment)
 *
 * assert.strictEqual(n, 0)
 * f()
 * assert.strictEqual(n, 1)
 * f()
 * assert.strictEqual(n, 2)
 * f()
 * assert.strictEqual(n, 2)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const whenInvocationCount =
  (p: Predicate<number>): Endomorphism<IO<void>> =>
  f => {
    /* eslint-disable */
    let n = 0

    return () => {
      n++
      if (p(n)) f()
    }
    /* eslint-enable */
  }

/**
 * Execute an `IO`, returning the value within. Helpful for staying within
 * function application and composition pipelines.
 *
 * @example
 * import { execute } from 'fp-ts-std/IO'
 * import * as IO from 'fp-ts/IO'
 *
 * assert.strictEqual(execute(IO.of(5)), 5)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const execute = <A>(x: IO<A>): A => x()

/**
 * Conditional execution of an `IO`. Helpful for things like logging.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { Predicate } from 'fp-ts/Predicate'
 * import { when } from 'fp-ts-std/IO'
 * import * as IOE from 'fp-ts/IOEither'
 * import { log } from 'fp-ts/Console'
 *
 * const isInvalid: Predicate<number> = n => n !== 42
 *
 * pipe(
 *   IOE.of(123),
 *   IOE.chainFirstIOK(n =>
 *     when(isInvalid(n))(log(n))),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const when: (x: boolean) => Endomorphism<IO<void>> = _when(
  IO.Applicative,
)

/**
 * The reverse of `when`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { Predicate } from 'fp-ts/Predicate'
 * import { unless } from 'fp-ts-std/IO'
 * import * as IOE from 'fp-ts/IOEither'
 * import { log } from 'fp-ts/Console'
 *
 * const isValid: Predicate<number> = n => n === 42
 *
 * pipe(
 *   IOE.of(123),
 *   IOE.chainFirstIOK(n =>
 *     unless(isValid(n))(log(n))),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const unless: (x: boolean) => Endomorphism<IO<void>> = _unless(
  IO.Applicative,
)

/**
 * Memoize an `IO`, reusing the result of its first execution.
 *
 * @example
 * import { memoize } from 'fp-ts-std/IO'
 * import { now } from 'fp-ts-std/Date'
 *
 * const then = memoize(now)
 *
 * assert.strictEqual(then(), then())
 *
 * @category 3 Functions
 * @since 0.14.0
 */
export const memoize = <A>(f: IO<A>): IO<A> => {
  const empty = Symbol()
  // eslint-disable-next-line functional/no-let
  let res: A | typeof empty = empty

  return () => (res === empty ? (res = f()) : res)
}

/**
 * Sequence an array of effects, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const sequenceArray_: <A>(xs: ReadonlyArray<IO<A>>) => IO<void> = flow(
  IO.sequenceArray,
  IO.map(constVoid),
)

/**
 * Map to and sequence an array of effects, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const traverseArray_: <A, B>(
  f: (x: A) => IO<B>,
) => (xs: ReadonlyArray<A>) => IO<void> = f =>
  flow(IO.traverseArray(f), IO.map(constVoid))
