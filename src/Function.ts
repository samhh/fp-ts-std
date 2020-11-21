/**
 * @since 0.1.0
 */

import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import { Endomorphism, flow, not, pipe, Predicate } from "fp-ts/function"
import { fold, getFunctionMonoid } from "fp-ts/Monoid"

/**
 * Flip the function/argument order of a curried function.
 *
 * Note that due to limitations to the type system, this function won't work
 * correctly for generic functions.
 *
 * @example
 * import { flip } from 'fp-ts-std/Function';
 *
 * const prepend = (x: string) => (y: string): string => x + y;
 * const append = flip(prepend);
 *
 * assert.strictEqual(prepend('x')('y'), 'xy');
 * assert.strictEqual(append('x')('y'), 'yx');
 *
 * @since 0.1.0
 */
export const flip = <
  A extends Array<unknown>,
  B extends Array<unknown>,
  C
  // eslint-disable-next-line functional/functional-parameters
>(
  f: (...a: A) => (...b: B) => C,
) => (...b: B) => (...a: A): C => f(...a)(...b)

/**
 * Given a curried function with an iterative callback, this returns a new
 * function that behaves identically except that it also supplies an index for
 * each iteration of the callback.
 *
 * @example
 * import * as A from 'fp-ts/Array';
 * import { withIndex } from 'fp-ts-std/Function';
 *
 * const mapWithIndex = withIndex<number, number, number>(A.map);
 * assert.deepStrictEqual(mapWithIndex(i => x => x + i)([1, 2, 3]), [1, 3, 5]);
 *
 * @since 0.5.0
 */
export const withIndex: <A, B, C>(
  f: (g: (x: A) => B) => (ys: Array<A>) => Array<C>,
) => (
  g: (i: number) => (x: A) => B,
) => (ys: Array<A>) => Array<C> = f => g => xs => {
  let i = 0 // eslint-disable-line functional/no-let
  return f(y => g(i++)(y))(xs)
}

/**
 * Converts a variadic function to a unary function.
 *
 * Whilst this isn't very useful for functions that ought to be curried,
 * it is helpful for functions which take an indefinite number of arguments
 * instead of more appropriately an array.
 *
 * @example
 * import { unary } from 'fp-ts-std/Function';
 *
 * const max = unary(Math.max);
 *
 * assert.strictEqual(max([1, 3, 2]), 3);
 *
 * @since 0.6.0
 */
export const unary = <A extends Array<unknown>, B>(f: (...xs: A) => B) => (
  xs: A,
): B => f(...xs)

/**
 * Apply a function, taking the data first. This can be thought of as ordinary
 * function application, but flipped.
 *
 * This is useful for applying functions point-free.
 *
 * @example
 * import { applyTo } from 'fp-ts-std/Function';
 * import { add, multiply } from 'fp-ts-std/Number';
 * import * as A from 'fp-ts/Array';
 * import { pipe, Endomorphism } from 'fp-ts/function';
 *
 * const calc: Array<Endomorphism<number>> = [add(1), multiply(2)];
 *
 * const output = pipe(calc, A.map(applyTo(5)));
 *
 * assert.deepStrictEqual(output, [6, 10]);
 *
 * @since 0.6.0
 */
export const applyTo = <A>(x: A) => <B>(f: (x: A) => B): B => f(x)

/**
 * Given an array of predicates and morphisms, returns the first morphism output
 * for which the paired predicate succeeded. If all predicates fail, the
 * fallback value is returned.
 *
 * This is analagous to Haskell's guards.
 *
 * @example
 * import { guard } from 'fp-ts-std/Function';
 * import { constant } from 'fp-ts/function';
 *
 * const numSize = guard<number, string>([
 *     [n => n > 100, n => `${n} is large!`],
 *     [n => n > 50, n => `${n} is medium.`],
 *     [n => n > 0, n => `${n} is small...`],
 * ])(n => `${n} is not a positive number.`);
 *
 * assert.strictEqual(numSize(101), '101 is large!');
 * assert.strictEqual(numSize(99), '99 is medium.');
 * assert.strictEqual(numSize(5), '5 is small...');
 * assert.strictEqual(numSize(-3), '-3 is not a positive number.');
 *
 * @since 0.6.0
 */
export const guard = <A, B>(branches: Array<[Predicate<A>, (x: A) => B]>) => (
  fallback: (x: A) => B,
) => (input: A): B =>
  pipe(
    branches,
    A.map(([f, g]) => flow(O.fromPredicate(f), O.map(g))),
    fold(getFunctionMonoid(O.getFirstMonoid<B>())<A>()),
    applyTo(input),
    O.getOrElse(() => fallback(input)),
  )

/**
 * Creates a function that processes the first morphism if the predicate
 * succeeds, else the second morphism.
 *
 * @example
 * import { ifElse } from 'fp-ts-std/Function';
 * import { increment, decrement } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isPositive: Predicate<number> = n => n > 0;
 * const normalise = ifElse(decrement)(increment)(isPositive);
 *
 * assert.strictEqual(normalise(-3), -2);
 * assert.strictEqual(normalise(3), 2);
 *
 * @since 0.6.0
 */
export const ifElse = <A, B>(onTrue: (x: A) => B) => (onFalse: (x: A) => B) => (
  f: Predicate<A>,
) => (x: A): B => (f(x) ? onTrue(x) : onFalse(x))

/**
 * Runs the provided morphism on the input value if the predicate fails.
 *
 * @example
 * import { unless } from 'fp-ts-std/Function';
 * import { increment } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const ensureEven = unless(isEven)(increment);
 *
 * assert.strictEqual(ensureEven(1), 2);
 * assert.strictEqual(ensureEven(2), 2);
 *
 * @since 0.6.0
 */
export const unless = <A>(f: Predicate<A>) => (
  onFalse: Endomorphism<A>,
): Endomorphism<A> => x => (f(x) ? x : onFalse(x))

/**
 * Runs the provided morphism on the input value if the predicate holds.
 *
 * @example
 * import { when } from 'fp-ts-std/Function';
 * import { increment } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const ensureOdd = when(isEven)(increment);
 *
 * assert.strictEqual(ensureOdd(1), 1);
 * assert.strictEqual(ensureOdd(2), 3);
 *
 * @since 0.6.0
 */
export const when: <A>(
  f: Predicate<A>,
) => (onTrue: Endomorphism<A>) => Endomorphism<A> = flow(not, unless)

/**
 * Yields the result of applying the morphism to the input until the predicate
 * holds.
 *
 * @example
 * import { until } from 'fp-ts-std/Function';
 * import { increment } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isOver100: Predicate<number> = n => n > 100;
 * const doubleUntilOver100 = until(isOver100)(n => n * 2);
 *
 * assert.strictEqual(doubleUntilOver100(1), 128);
 *
 * @since 0.6.0
 */
export const until = <A>(f: Predicate<A>) => (
  g: Endomorphism<A>,
): Endomorphism<A> => {
  const h: Endomorphism<A> = x => (f(x) ? x : h(g(x)))
  return h
}

/**
 * Wraps a constructor function for functional invocation.
 *
 * @example
 * import { construct } from 'fp-ts-std/Function';
 *
 * const mkURL = construct(URL);
 *
 * const xs: [string, string] = ['/x/y/z.html', 'https://samhh.com'];
 *
 * assert.deepStrictEqual(mkURL(xs), new URL(...xs));
 *
 * @since 0.7.0
 */
export const construct = <A extends Array<unknown>, B>(
  x: new (...xs: A) => B,
) => (xs: A): B => new x(...xs)
