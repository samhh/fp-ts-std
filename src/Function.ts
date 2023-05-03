/**
 * Note that some limitations exist in the type system pertaining to
 * polymorphic (generic) functions which could impact the usage of any of the
 * functions here. All of these functions will work provided monomorphic
 * (non-generic) input functions.
 *
 * @since 0.1.0
 */

import * as O from "fp-ts/Option"
import * as M from "fp-ts/Map"
import * as A from "fp-ts/Array"
import {
  flow,
  pipe,
  getMonoid as getFunctionMonoid,
  apply,
  constant,
  flip,
} from "fp-ts/function"
import { Predicate, not } from "fp-ts/Predicate"
import { Endomorphism, getMonoid as getEndoMonoid } from "fp-ts/Endomorphism"
import { concatAll } from "fp-ts/Monoid"
import { first } from "fp-ts/Semigroup"
import { Eq } from "fp-ts/Eq"
import { Refinement } from "fp-ts/Refinement"
import { Functor2 } from "fp-ts/Functor"
import { Applicative2 } from "fp-ts/Applicative"
import { Monad2 } from "fp-ts/Monad"

/**
 * Typeclass machinery.
 *
 * @since 0.15.0
 */
export const URI = "Function"

/**
 * Typeclass machinery.
 *
 * @since 0.15.0
 */
export type URI = typeof URI

declare module "fp-ts/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: (x: E) => A
  }
}

/**
 * Map a unary function's output. Equivalent to function composition.
 *
 * @since 0.15.0
 */
export const map: <B, C>(
  f: (x: B) => C,
) => <A>(g: (x: A) => B) => (x: A) => C = f => g => flow(g, f)

/**
 * Formal `Functor` instance for unary functions to be provided to
 * higher-kinded functions that require it.
 *
 * @since 0.15.0
 */
export const Functor: Functor2<URI> = {
  URI,
  map: (f, g) => map(g)(f),
}

/**
 * Lift a value to a function from any other value. Equivalent to `constant`.
 *
 * @since 0.15.0
 */
export const of: <A>(x: A) => <B>(y: B) => A = constant

/**
 * Fork an input across a binary and a tertiary function, applying the output
 * of the former to the latter.
 *
 * @since 0.15.0
 */
export const ap: <A, B>(
  f: (x: A) => B,
) => <C>(g: (x: A) => (y: B) => C) => (x: A) => C = f => g => x => g(x)(f(x))

/**
 * Formal `Applicative` instance for unary functions to be provided to
 * higher-kinded functions that require it.
 *
 * @since 0.15.0
 */
export const Applicative: Applicative2<URI> = {
  ...Functor,
  of,
  ap: (f, g) => ap(g)(f),
}

/**
 * Fork an input across a binary and a tertiary function, applying the output of
 * the former to the latter. As it applies to functions this is essentially
 * `ap` with some flips thrown in.
 *
 * @since 0.15.0
 */
export const chain: <A, B, C>(
  f: (x: B) => (y: A) => C,
  // eslint-disable-next-line functional/prefer-tacit
) => (g: (x: A) => B) => (x: A) => C = f => g => x => f(g(x))(x)

/**
 * Alias of `chain`.
 *
 * @since 0.17.0
 */
export const flatMap = chain

/**
 * Formal `Monad` instance for unary functions to be provided to higher-kinded
 * functions that require it.
 *
 * @since 0.15.0
 */
export const Monad: Monad2<URI> = {
  ...Applicative,
  chain: (f, g) => chain(g)(f),
}

/**
 * Given a curried function with an iterative callback, this returns a new
 * function that behaves identically except that it also supplies an index for
 * each iteration of the callback.
 *
 * @example
 * import * as A from 'fp-ts/Array'
 * import { withIndex } from 'fp-ts-std/Function'
 *
 * const mapWithIndex = withIndex<number, number, number>(A.map)
 * assert.deepStrictEqual(mapWithIndex(i => x => x + i)([1, 2, 3]), [1, 3, 5])
 *
 * @since 0.5.0
 */
export const withIndex: <A, B, C>(
  f: (g: (x: A) => B) => (ys: Array<A>) => Array<C>,
) => (g: (i: number) => (x: A) => B) => (ys: Array<A>) => Array<C> =
  f => g => xs => {
    // eslint-disable-next-line functional/no-let
    let i = 0
    // eslint-disable-next-line functional/prefer-tacit
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
 * import { unary } from 'fp-ts-std/Function'
 *
 * const max = unary(Math.max)
 *
 * assert.strictEqual(max([1, 3, 2]), 3)
 *
 * @since 0.6.0
 */
export const unary =
  <A extends Array<unknown>, B>(f: (...xs: A) => B) =>
  (xs: A): B =>
    f(...xs)

/**
 * Given an array of predicates and morphisms, returns the first morphism output
 * for which the paired predicate succeeded. If all predicates fail, the
 * fallback value is returned.
 *
 * This is analagous to Haskell's guards.
 *
 * @example
 * import { guard } from 'fp-ts-std/Function'
 * import { constant } from 'fp-ts/function'
 *
 * const numSize = guard<number, string>([
 *     [n => n > 100, n => `${n} is large!`],
 *     [n => n > 50, n => `${n} is medium.`],
 *     [n => n > 0, n => `${n} is small...`],
 * ])(n => `${n} is not a positive number.`)
 *
 * assert.strictEqual(numSize(101), '101 is large!')
 * assert.strictEqual(numSize(99), '99 is medium.')
 * assert.strictEqual(numSize(5), '5 is small...')
 * assert.strictEqual(numSize(-3), '-3 is not a positive number.')
 *
 * @since 0.6.0
 */
export const guard =
  <A, B>(branches: Array<[Predicate<A>, (x: A) => B]>) =>
  (fallback: (x: A) => B) =>
  (input: A): B =>
    pipe(
      branches,
      A.map(([f, g]) => flow(O.fromPredicate(f), O.map(g))),
      concatAll(getFunctionMonoid(O.getMonoid<B>(first()))<A>()),
      apply(input),
      O.getOrElse(() => fallback(input)),
    )

/**
 * Creates a function that processes the first morphism if the predicate
 * succeeds, else the second morphism.
 *
 * @example
 * import { ifElse } from 'fp-ts-std/Function'
 * import { increment, decrement } from 'fp-ts-std/Number'
 * import { Predicate } from 'fp-ts/Predicate'
 *
 * const isPositive: Predicate<number> = n => n > 0
 * const normalise = ifElse(decrement)(increment)(isPositive)
 *
 * assert.strictEqual(normalise(-3), -2)
 * assert.strictEqual(normalise(3), 2)
 *
 * @since 0.6.0
 */
export const ifElse =
  <A, B>(onTrue: (x: A) => B) =>
  (onFalse: (x: A) => B) =>
  (f: Predicate<A>) =>
  (x: A): B =>
    f(x) ? onTrue(x) : onFalse(x)

/**
 * Runs the provided morphism on the input value if the predicate fails.
 *
 * @example
 * import { unless } from 'fp-ts-std/Function'
 * import { increment } from 'fp-ts-std/Number'
 * import { Predicate } from 'fp-ts/Predicate'
 *
 * const isEven: Predicate<number> = n => n % 2 === 0
 * const ensureEven = unless(isEven)(increment)
 *
 * assert.strictEqual(ensureEven(1), 2)
 * assert.strictEqual(ensureEven(2), 2)
 *
 * @since 0.6.0
 */
export const unless =
  <A>(f: Predicate<A>) =>
  (onFalse: Endomorphism<A>): Endomorphism<A> =>
  x =>
    f(x) ? x : onFalse(x)

/**
 * Runs the provided morphism on the input value if the predicate holds.
 *
 * @example
 * import { when } from 'fp-ts-std/Function'
 * import { increment } from 'fp-ts-std/Number'
 * import { Predicate } from 'fp-ts/Predicate'
 *
 * const isEven: Predicate<number> = n => n % 2 === 0
 * const ensureOdd = when(isEven)(increment)
 *
 * assert.strictEqual(ensureOdd(1), 1)
 * assert.strictEqual(ensureOdd(2), 3)
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
 * import { until } from 'fp-ts-std/Function'
 * import { increment } from 'fp-ts-std/Number'
 * import { Predicate } from 'fp-ts/Predicate'
 *
 * const isOver100: Predicate<number> = n => n > 100
 * const doubleUntilOver100 = until(isOver100)(n => n * 2)
 *
 * assert.strictEqual(doubleUntilOver100(1), 128)
 *
 * @since 0.6.0
 */
export const until =
  <A>(f: Predicate<A>) =>
  (g: Endomorphism<A>): Endomorphism<A> => {
    const h: Endomorphism<A> = x => (f(x) ? x : h(g(x)))
    return h
  }

/**
 * Wraps a constructor function for functional invocation.
 *
 * @example
 * import { construct } from 'fp-ts-std/Function'
 *
 * const mkURL = construct(URL)
 *
 * const xs: [string, string] = ['/x/y/z.html', 'https://samhh.com']
 *
 * assert.deepStrictEqual(mkURL(xs), new URL(...xs))
 *
 * @since 0.7.0
 */
export const construct =
  <A extends Array<unknown>, B>(x: new (...xs: A) => B) =>
  (xs: A): B =>
    new x(...xs)

/**
 * Invoke a method of the specified name with the provided arguments on an
 * object. Helpful for a one-time usage of an object-oriented construct you're
 * working with that doesn't have functional bindings.
 *
 * To write your own bindings more conveniently, check out `invokeOn`.
 *
 * @example
 * import { invoke } from 'fp-ts-std/Function'
 *
 * const f = invoke('padStart')([8, '.'])
 *
 * assert.strictEqual(f('hello'), '...hello')
 *
 * @since 0.12.0
 */
export const invoke =
  <A extends string>(x: A) =>
  <B extends Array<unknown>>(ys: [...B]) =>
  <C>(z: Record<A, (...xs: B) => C>): C =>
    z[x](...ys)

/**
 * `invoke` specialised to nullary methods.
 *
 * @example
 * import { invokeNullary } from 'fp-ts-std/Function'
 *
 * const f = invokeNullary('trim')
 *
 * assert.strictEqual(f(' hello '), 'hello')
 *
 * @since 0.14.0
 */
export const invokeNullary: <A extends string>(
  x: A,
) => <B>(y: Record<A, () => B>) => B = flip(invoke)([])

/**
 * Like `invoke`, but takes an initial type argument to hint at what shape the
 * arguments tuple should be. This function is useful for producing bindings for
 * object-oriented methods in tandem with the tuple*N*T range of functions.
 *
 * @example
 * import { invokeOn, curry2T } from 'fp-ts-std/Function'
 *
 * const padStart = curry2T(invokeOn<string>()('padStart'))
 * const x = 'hello'
 *
 * assert.strictEqual(padStart(8)('.')(x), x.padStart(8, '.'))
 *
 * @since 0.12.0
 */
// Type parameter D allows the end user to override what's inferred in case of
// optional arguments, which upsets the compiler when then passed onto something
// like curry2T.
//
// The Arguments array needs to contain any instead of unknown for some reason.
export const invokeOn =
  <A>() =>
  <
    B extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [K in keyof A]: A[K] extends (...xs: Array<any>) => unknown ? A[K] : never
    },
    C extends keyof B,
  >(
    x: C,
  ): ((xs: Required<Parameters<B[C]>>) => (y: B) => ReturnType<B[C]>) =>
  ys =>
  z =>
    z[x](...ys) as ReturnType<B[C]>

/**
 * Given a function and an `Eq` instance for determining input equivalence,
 * returns a new function that caches the result of applying an input to said
 * function. If the cache hits, the cached value is returned and the function
 * is not called again. Useful for expensive computations.
 *
 * Provided the input function is pure, this function is too.
 *
 * The cache is implemented as a simple `Map`. There is no mechanism by which
 * cache entries can be cleared from memory.
 *
 * @example
 * import { memoize } from 'fp-ts-std/Function'
 * import { add } from 'fp-ts-std/Number'
 * import { eqNumber } from 'fp-ts/Eq'
 *
 * let runs = 0
 * const f = memoize(eqNumber)(n => {
 *     runs++
 *     return add(5)(n)
 * })
 *
 * assert.strictEqual(runs, 0)
 * assert.strictEqual(f(2), 7)
 * assert.strictEqual(runs, 1)
 * assert.strictEqual(f(2), 7)
 * assert.strictEqual(runs, 1)
 *
 * @since 0.7.0
 */
export const memoize =
  <A>(eq: Eq<A>) =>
  <B>(f: (x: A) => B): ((x: A) => B) => {
    const cache = new Map<A, B>()

    return k => {
      const cached = M.lookup(eq)(k)(cache)
      if (O.isSome(cached)) return cached.value // eslint-disable-line functional/no-conditional-statements

      const val = f(k)
      cache.set(k, val) // eslint-disable-line functional/no-expression-statements
      return val
    }
  }

/**
 * Curry a function with binary tuple input.
 *
 * @example
 * import { curry2T } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat2 = ([a, b]: [string, string]): string =>
 *      a + b
 * assert.strictEqual(curry2T(concat2)('a')('b'), concat2(['a', 'b']))
 *
 * @since 0.7.0
 */
export const curry2T =
  <A, B, C>(f: (xs: [A, B]) => C) =>
  (a: A) =>
  (b: B): C =>
    f([a, b])

/**
 * Curry a function with binary input.
 *
 * @example
 * import { curry2 } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat2 = (a: string, b: string): string =>
 *      a + b
 * assert.strictEqual(curry2(concat2)('a')('b'), concat2('a', 'b'))
 *
 * @since 0.7.0
 */
export const curry2: <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C =
  flow(unary, curry2T)

/**
 * Curry a function with ternary tuple input.
 *
 * @example
 * import { curry3T } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat3 = ([a, b, c]: [string, string, string]): string =>
 *      a + b + c
 * assert.strictEqual(curry3T(concat3)('a')('b')('c'), concat3(['a', 'b', 'c']))
 *
 * @since 0.7.0
 */
export const curry3T =
  <A, B, C, D>(f: (xs: [A, B, C]) => D) =>
  (a: A) =>
  (b: B) =>
  (c: C): D =>
    f([a, b, c])

/**
 * Curry a function with ternary input.
 *
 * @example
 * import { curry3 } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat3 = (a: string, b: string, c: string): string =>
 *      a + b + c
 * assert.strictEqual(curry3(concat3)('a')('b')('c'), concat3('a', 'b', 'c'))
 *
 * @since 0.7.0
 */
export const curry3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D,
) => (a: A) => (b: B) => (c: C) => D = flow(unary, curry3T)

/**
 * Curry a function with quaternary tuple input.
 *
 * @example
 * import { curry4T } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat4 = ([a, b, c, d]: [string, string, string, string]): string =>
 *      a + b + c + d
 * assert.strictEqual(curry4T(concat4)('a')('b')('c')('d'), concat4(['a', 'b', 'c', 'd']))
 *
 * @since 0.7.0
 */
export const curry4T =
  <A, B, C, D, E>(f: (xs: [A, B, C, D]) => E) =>
  (a: A) =>
  (b: B) =>
  (c: C) =>
  (d: D): E =>
    f([a, b, c, d])

/**
 * Curry a function with quaternary input.
 *
 * @example
 * import { curry4 } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat4 = (a: string, b: string, c: string, d: string): string =>
 *      a + b + c + d
 * assert.strictEqual(curry4(concat4)('a')('b')('c')('d'), concat4('a', 'b', 'c', 'd'))
 *
 * @since 0.7.0
 */
export const curry4: <A, B, C, D, E>(
  f: (a: A, b: B, c: C, d: D) => E,
) => (a: A) => (b: B) => (c: C) => (d: D) => E = flow(unary, curry4T)

/**
 * Curry a function with quinary tuple input.
 *
 * @example
 * import { curry5T } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat5 = ([a, b, c, d, e]: [string, string, string, string, string]): string =>
 *      a + b + c + d + e
 * assert.strictEqual(curry5T(concat5)('a')('b')('c')('d')('e'), concat5(['a', 'b', 'c', 'd', 'e']))
 *
 * @since 0.7.0
 */
export const curry5T =
  <A, B, C, D, E, F>(f: (xs: [A, B, C, D, E]) => F) =>
  (a: A) =>
  (b: B) =>
  (c: C) =>
  (d: D) =>
  (e: E): F =>
    f([a, b, c, d, e])

/**
 * Curry a function with quinary input.
 *
 * @example
 * import { curry5 } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat5 = (a: string, b: string, c: string, d: string, e: string): string =>
 *      a + b + c + d + e
 * assert.strictEqual(curry5(concat5)('a')('b')('c')('d')('e'), concat5('a', 'b', 'c', 'd', 'e'))
 *
 * @since 0.7.0
 */
export const curry5: <A, B, C, D, E, F>(
  f: (a: A, b: B, c: C, d: D, e: E) => F,
) => (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F = flow(unary, curry5T)

/**
 * Uncurry a binary function.
 *
 * @example
 * import { uncurry2 } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat2 = (a: string): Endomorphism<string> => b =>
 *      a + b
 * assert.strictEqual(uncurry2(concat2)(['a', 'b']), concat2('a')('b'))
 *
 * @since 0.7.0
 */
export const uncurry2 =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  ([a, b]: [A, B]): C =>
    f(a)(b)

/**
 * Uncurry a ternary function.
 *
 * @example
 * import { uncurry3 } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat3 = (a: string) => (b: string): Endomorphism<string> => c =>
 *      a + b + c
 * assert.strictEqual(uncurry3(concat3)(['a', 'b', 'c']), concat3('a')('b')('c'))
 *
 * @since 0.7.0
 */
export const uncurry3 =
  <A, B, C, D>(f: (a: A) => (b: B) => (c: C) => D) =>
  ([a, b, c]: [A, B, C]): D =>
    f(a)(b)(c)

/**
 * Uncurry a quaternary function.
 *
 * @example
 * import { uncurry4 } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat4 = (a: string) => (b: string) => (c: string): Endomorphism<string> => d =>
 *      a + b + c + d
 * assert.strictEqual(uncurry4(concat4)(['a', 'b', 'c', 'd']), concat4('a')('b')('c')('d'))
 *
 * @since 0.7.0
 */
export const uncurry4 =
  <A, B, C, D, E>(f: (a: A) => (b: B) => (c: C) => (d: D) => E) =>
  ([a, b, c, d]: [A, B, C, D]): E =>
    f(a)(b)(c)(d)

/**
 * Uncurry a quinary function.
 *
 * @example
 * import { uncurry5 } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 *
 * const concat5 = (a: string) => (b: string) => (c: string) => (d: string): Endomorphism<string> => e =>
 *      a + b + c + d + e
 * assert.strictEqual(uncurry5(concat5)(['a', 'b', 'c', 'd', 'e']), concat5('a')('b')('c')('d')('e'))
 *
 * @since 0.7.0
 */
export const uncurry5 =
  <A, B, C, D, E, F>(f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F) =>
  ([a, b, c, d, e]: [A, B, C, D, E]): F =>
    f(a)(b)(c)(d)(e)

/**
 * Fork an input across a series of functions, collecting the results in a
 * tuple. Similar to `flap` but overloaded for variadic tuples. Similar to
 * `fanout` but supporting variadic rather than binary tuples.
 *
 * @example
 * import { fork } from 'fp-ts-std/Function'
 * import { add } from 'fp-ts-std/Number'
 * import * as S from 'fp-ts-std/String'
 *
 * const add1 = add(1)
 * const add2 = add(2)
 *
 * assert.deepStrictEqual(fork([add1, S.fromNumber, add2])(0), [1, '0', 2])
 *
 * @since 0.11.0
 */
// Don't use a type alias for any of this as it worsens the docs output
export function fork<A, B, C>(fs: [(x: A) => B, (x: A) => C]): (x: A) => [B, C]
export function fork<A, B, C, D>(
  fs: [(x: A) => B, (x: A) => C, (x: A) => D],
): (x: A) => [B, C, D]
export function fork<A, B, C, D, E>(
  fs: [(x: A) => B, (x: A) => C, (x: A) => D, (x: A) => E],
): (x: A) => [B, C, D, E]
export function fork<A, B, C, D, E, F>(
  fs: [(x: A) => B, (x: A) => C, (x: A) => D, (x: A) => E, (x: A) => F],
): (x: A) => [B, C, D, E, F]
export function fork<A, B, C, D, E, F, G>(
  fs: [
    (x: A) => B,
    (x: A) => C,
    (x: A) => D,
    (x: A) => E,
    (x: A) => F,
    (x: A) => G,
  ],
): (x: A) => [B, C, D, E, F, G]
export function fork<A, B, C, D, E, F, G, H>(
  fs: [
    (x: A) => B,
    (x: A) => C,
    (x: A) => D,
    (x: A) => E,
    (x: A) => F,
    (x: A) => G,
    (x: A) => H,
  ],
): (x: A) => [B, C, D, E, F, G, H]
export function fork<A, B, C, D, E, F, G, H, I>(
  fs: [
    (x: A) => B,
    (x: A) => C,
    (x: A) => D,
    (x: A) => E,
    (x: A) => F,
    (x: A) => G,
    (x: A) => H,
    (x: A) => I,
  ],
): (x: A) => [B, C, D, E, F, G, H, I]
export function fork<A, B, C, D, E, F, G, H, I, J>(
  fs: [
    (x: A) => B,
    (x: A) => C,
    (x: A) => D,
    (x: A) => E,
    (x: A) => F,
    (x: A) => G,
    (x: A) => H,
    (x: A) => I,
    (x: A) => J,
  ],
): (x: A) => [B, C, D, E, F, G, H, I, J]
export function fork<A, B, C, D, E, F, G, H, I, J>(
  fs: [
    (x: A) => B,
    (x: A) => C,
    ((x: A) => D)?,
    ((x: A) => E)?,
    ((x: A) => F)?,
    ((x: A) => G)?,
    ((x: A) => H)?,
    ((x: A) => I)?,
    ((x: A) => J)?,
  ],
): unknown {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (x: A): unknown => fs.map(f => f!(x))
}

/**
 * Takes a converging function and a tuple of branching functions. The branched
 * return values are collected in a tuple and passed to the converging function.
 *
 * @example
 * import { converge } from 'fp-ts-std/Function'
 * import { flow, identity } from 'fp-ts/function'
 * import * as S from 'fp-ts-std/String'
 * import * as A from 'fp-ts-std/Array'
 *
 * const f = converge(A.join(' '))([S.append('!'), identity, S.prepend('?')])
 *
 * assert.deepStrictEqual(f('hello'), 'hello! hello ?hello')
 *
 * @since 0.12.0
 */
// The tuple [B, ...C] allows the compiler to infer A in gs without the need
// for x to be piped in first.
export const converge =
  <B, C extends Array<B>, D>(f: (xs: [B, ...C]) => D) =>
  <A>(
    gs: [(x: A) => B, ...{ [K in keyof C]: (x: A) => C[K] }],
  ): ((x: A) => D) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    flow(x => fork(gs as any)(x) as unknown as [B, ...C], f)

/**
 * A curried function equivalent to the `instanceof` operator, for when you
 * absolutely must test a prototype.
 *
 * @example
 * import { isInstanceOf } from 'fp-ts-std/Function'
 *
 * const isStringInstance = isInstanceOf(String)
 *
 * assert.strictEqual(isStringInstance('ciao'), false)
 * assert.strictEqual(isStringInstance(new String('ciao')), true)
 *
 * @since 0.12.0
 */
export const isInstanceOf =
  <A>(x: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: Array<any>): A
  }): Refinement<unknown, A> =>
  (y: unknown): y is A =>
    y instanceof x

/**
 * Apply an array of endomorphisms from left-to-right.
 *
 * @example
 * import { applyEvery } from 'fp-ts-std/Function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 * import { increment, multiply } from 'fp-ts-std/Number'
 *
 * const fs: Array<Endomorphism<number>> = [increment, multiply(3)]
 * const g = applyEvery(fs)
 *
 * assert.deepStrictEqual(g(1), 6)
 * assert.deepStrictEqual(g(3), 12)
 *
 * @since 0.12.0
 */
export const applyEvery: <A>(fs: Array<Endomorphism<A>>) => Endomorphism<A> =
  concatAll(getEndoMonoid())

/**
 * Apply an array of potential endomorphisms from left-to-right, skipping any
 * that are `None`.
 *
 * @example
 * import { applySomes } from 'fp-ts-std/Function'
 * import * as O from 'fp-ts/Option'
 * import { Option } from 'fp-ts/Option'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 * import { increment, multiply } from 'fp-ts-std/Number'
 *
 * const fs: Array<Option<Endomorphism<number>>> = [O.some(increment), O.none, O.some(multiply(3))]
 * const g = applySomes(fs)
 *
 * assert.deepStrictEqual(g(1), 6)
 * assert.deepStrictEqual(g(3), 12)
 *
 * @since 0.13.0
 */
export const applySomes =
  <A>(fs: Array<O.Option<Endomorphism<A>>>): Endomorphism<A> =>
  x =>
    pipe(
      fs,
      A.reduce(x, (y, mf) => pipe(mf, O.match(constant(y), apply(y)))),
    )

/**
 * Apply a function the specified number of times. `n` will be normalised to a
 * non-negative integer according to the semantics of `A.replicate`.
 *
 * @example
 * import { applyN } from 'fp-ts-std/Function'
 * import { increment } from 'fp-ts-std/Number'
 *
 * const add3 = applyN(3)(increment)
 *
 * assert.strictEqual(add3(2), 5)
 *
 * @since 0.17.0
 */
export const applyN =
  (n: number) =>
  <A>(f: Endomorphism<A>): Endomorphism<A> =>
    pipe(A.replicate(n, f), applyEvery)
