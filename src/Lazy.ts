/**
 * Whilst the definition of `Lazy` happens to be the same as `IO`, they
 * represent different intentions, specifically with respect to `Lazy`
 * representing a pure thunk.
 *
 * Thinking in terms of Haskell, `Lazy` can be considered equivalent to a pure
 * function that takes `()` (unit) as input.
 *
 * @since 0.12.0
 */

// All the typeclass stuff was copied from fp-ts/IO almost identically.

import { constant, identity } from "fp-ts/lib/function.js"
import {
  Functor1,
  flap as flap_,
  bindTo as bindTo_,
  let as let__,
} from "fp-ts/lib/Functor.js"
import { Applicative1 } from "fp-ts/lib/Applicative.js"
import { Monad1 } from "fp-ts/lib/Monad.js"
import { Pointed1 } from "fp-ts/lib/Pointed.js"
import {
  Apply1,
  apFirst as apFirst_,
  apS as apS_,
  apSecond as apSecond_,
} from "fp-ts/lib/Apply.js"
import {
  Chain1,
  bind as bind_,
  chainFirst as chainFirst_,
} from "fp-ts/lib/Chain.js"
import { ChainRec1 } from "fp-ts/lib/ChainRec.js"
import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray.js"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray.js"
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray.js"
import * as RA from "fp-ts/lib/ReadonlyArray.js"

/**
 * Re-exported from fp-ts for convenience.
 *
 * @category 0 Types
 * @since 0.12.0
 */
// docs-ts output will be bad if we "export from".
export type Lazy<A> = () => A

/**
 * Typeclass machinery.
 *
 * @category 4 Minutiae
 * @since 0.12.0
 */
export const URI = "Lazy"

/**
 * Typeclass machinery.
 *
 * @category 4 Minutiae
 * @since 0.12.0
 */
export type URI = typeof URI

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: Lazy<A>
  }
}

const _map: Functor1<URI>["map"] = (f, g) => () => g(f())
const _ap: Applicative1<URI>["ap"] = (f, g) => () => f()(g())
const _chain: Monad1<URI>["chain"] = (f, g) => g(f())
const _chainRec: ChainRec1<URI>["chainRec"] = (a, f) => () => {
  /* eslint-disable */
  let e = f(a)()
  while (e._tag === "Left") {
    e = f(e.left)()
  }
  /* eslint-enable */
  return e.right
}

/**
 * Map the output of a `Lazy`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const map =
  <A, B>(f: (x: A) => B) =>
  (fa: Lazy<A>): Lazy<B> =>
    _map(fa, f)

/**
 * Apply a function within a `Lazy`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const ap: <A>(fa: Lazy<A>) => <B>(fab: Lazy<(a: A) => B>) => Lazy<B> =
  fa => fab =>
    _ap(fab, fa)

/**
 * Raise any value to a `Lazy`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const of: Pointed1<URI>["of"] = constant

/**
 * Map and flatten the output of a `Lazy`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const chain: <A, B>(f: (a: A) => Lazy<B>) => (ma: Lazy<A>) => Lazy<B> =
  f => ma =>
    _chain(ma, f)

/**
 * Alias of `chain`.
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const flatMap = chain

/**
 * Flatten a nested `Lazy`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const flatten: <A>(mma: Lazy<Lazy<A>>) => Lazy<A> = chain(identity)

/**
 * Formal `Functor` instance for `Lazy` to be provided to higher-kinded
 * functions that require it.
 *
 * @category 1 Typeclass Instances
 * @since 0.12.0
 */
export const Functor: Functor1<URI> = {
  URI,
  map: _map,
}

/**
 * Takes a function in a functorial `Lazy` context and applies it to an
 * ordinary value.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const flap = flap_(Functor)

/**
 * Formal `Pointed` instance for `Lazy` to be provided to higher-kinded
 * functions that require it.
 *
 * @category 1 Typeclass Instances
 * @since 0.12.0
 */
export const Pointed: Pointed1<URI> = {
  URI,
  of,
}

/**
 * Formal `Apply` instance for `Lazy` to be provided to higher-kinded functions
 * that require it.
 *
 * @category 1 Typeclass Instances
 * @since 0.12.0
 */
export const Apply: Apply1<URI> = {
  URI,
  map: _map,
  ap: _ap,
}

/**
 * Sequence actions, discarding the value of the first argument.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const apFirst = apFirst_(Apply)

/**
 * Sequence actions, discarding the value of the second argument.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const apSecond = apSecond_(Apply)

/**
 * Formal `Applicative` instance for `Lazy` to be provided to higher-kinded
 * functions that require it.
 *
 * @category 1 Typeclass Instances
 * @since 0.12.0
 */
export const Applicative: Applicative1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
}

/**
 * Formal `Chain` instance for `Lazy` to be provided to higher-kinded functions
 * that require it.
 *
 * @category 1 Typeclass Instances
 * @since 0.12.0
 */
export const Chain: Chain1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
}

/**
 * Formal `Monad` instance for `Lazy` to be provided to higher-kinded functions
 * that require it.
 *
 * @category 1 Typeclass Instances
 * @since 0.12.0
 */
export const Monad: Monad1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: _chain,
}

/**
 * Like `chain`, but discards the new output.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const chainFirst = chainFirst_(Chain)

/**
 * Formal `ChainRec` instance for `Lazy` to be provided to higher-kinded
 * functions that require it.
 *
 * @category 1 Typeclass Instances
 * @since 0.12.0
 */
export const ChainRec: ChainRec1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
  chainRec: _chainRec,
}

/**
 * Initiate do notation in the context of `Lazy`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const Do: Lazy<{}> = of({})

/**
 * Bind the provided value, typically preceding it in a pipeline, to the
 * specified key in do notation.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const bindTo = bindTo_(Functor)

/**
 * Bind the output of the provided function to the specified key in do notation.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const bind = bind_(Chain)

/**
 * Bind the provided value to the specified key in do notation.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const apS = apS_(Apply)

const let_ = let__(Functor)

export {
  /**
   * Assign a variable in do notation.
   *
   * @category 2 Typeclass Methods
   * @since 0.17.0
   */
  let_ as let,
}

/**
 * Identity for `Lazy` as applied to `sequenceT`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const ApT: Lazy<readonly []> = of([])

/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const traverseReadonlyNonEmptyArrayWithIndex =
  <A, B>(f: (index: number, a: A) => Lazy<B>) =>
  (as: ReadonlyNonEmptyArray<A>): Lazy<ReadonlyNonEmptyArray<B>> =>
  () => {
    const out: NonEmptyArray<B> = [f(0, RNEA.head(as))()]
    /* eslint-disable */
    for (let i = 1; i < as.length; i++) {
      out.push(f(i, as[i])())
    }
    /* eslint-enable */
    return out
  }

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const traverseReadonlyArrayWithIndex = <A, B>(
  f: (index: number, a: A) => Lazy<B>,
): ((as: ReadonlyArray<A>) => Lazy<ReadonlyArray<B>>) => {
  const g = traverseReadonlyNonEmptyArrayWithIndex(f)
  return as => (RA.isNonEmpty(as) ? g(as) : ApT)
}

/**
 * Equivalent to `Array#traverseWithIndex(Applicative)`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const traverseArrayWithIndex: <A, B>(
  f: (index: number, a: A) => Lazy<B>,
) => (as: ReadonlyArray<A>) => Lazy<ReadonlyArray<B>> =
  traverseReadonlyArrayWithIndex

/**
 * Equivalent to `Array#traverse(Applicative)`.
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const traverseArray = <A, B>(
  f: (a: A) => Lazy<B>,
): ((as: ReadonlyArray<A>) => Lazy<ReadonlyArray<B>>) =>
  traverseReadonlyArrayWithIndex((_, a) => f(a))

/**
 * Equivalent to `Array#sequence(Applicative)`.
 *
 * @category 2 Typeclass Methods
 * @since 2.9.0
 */
export const sequenceArray: <A>(
  arr: ReadonlyArray<Lazy<A>>,
) => Lazy<ReadonlyArray<A>> = traverseArray(identity)

/**
 * Execute a `Lazy`, returning the value within. Helpful for staying within
 * function application and composition pipelines.
 *
 * @example
 * import * as Lazy from 'fp-ts-std/Lazy'
 *
 * assert.strictEqual(Lazy.execute(Lazy.of(5)), 5)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const execute = <A>(x: Lazy<A>): A => x()

/**
 * A constructor for `Lazy` values. Given `Lazy` is a type alias around
 * `() => A`, this function's only purpose is to aid in readability and express
 * intentional laziness, as opposed to for example forgetting or opting not to
 * use `constant`.
 *
 * @example
 * import { lazy } from 'fp-ts-std/Lazy'
 *
 * const calc = lazy(() => 'do something expensive here')
 *
 * @category 3 Functions
 * @since 0.13.0
 */
export const lazy: <A>(f: () => A) => Lazy<A> = identity

/**
 * Memoize a `Lazy`. Provided the input function is pure, this function is too.
 *
 * @example
 * import { lazy, memoize } from 'fp-ts-std/Lazy'
 *
 * const expensive = lazy(() => 42)
 * const payOnce = memoize(expensive)
 *
 * assert.strictEqual(payOnce(), payOnce())
 *
 * @category 3 Functions
 * @since 0.14.0
 */
export const memoize = <A>(f: Lazy<A>): Lazy<A> => {
  const empty = Symbol()
  // eslint-disable-next-line functional/no-let
  let res: A | typeof empty = empty

  return () => (res === empty ? (res = f()) : res)
}
