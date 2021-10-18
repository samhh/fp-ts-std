/**
 * @since 0.12.0
 */
import { either as E, eq as EQ, option as O, readonlyArray as A } from "fp-ts"
import { Alt1 } from "fp-ts/lib/Alt"
import { Applicative1 } from "fp-ts/lib/Applicative"
import { Apply1 } from "fp-ts/lib/Apply"
import { Chain1 } from "fp-ts/lib/Chain"
import { Compactable1 } from "fp-ts/lib/Compactable"
import {
  FilterableWithIndex1,
  PredicateWithIndex,
  RefinementWithIndex,
} from "fp-ts/lib/FilterableWithIndex"
import { FoldableWithIndex1 } from "fp-ts/lib/FoldableWithIndex"
import { pipe } from "fp-ts/lib/function"
import { FunctorWithIndex1 } from "fp-ts/lib/FunctorWithIndex"
import { Monad1 } from "fp-ts/lib/Monad"
import { Pointed1 } from "fp-ts/lib/Pointed"
import { Predicate } from "fp-ts/lib/Predicate"
import { Refinement } from "fp-ts/lib/Refinement"
import { Zero1 } from "fp-ts/lib/Zero"

/**
 * @category Model
 * @since 0.12.0
 */
export const URI = "Iterable"

/**
 * @category Model
 * @since 0.12.0
 */
export type URI = typeof URI

declare module "fp-ts/HKT" {
  // eslint-disable-next-line functional/prefer-type-literal
  export interface URItoKind<A> {
    readonly [URI]: Iterable<A>
  }
}

/**
 * @category Pointed
 * @since 0.12.0
 */
export const of: Pointed1<URI>["of"] = a => ({
  *[Symbol.iterator]() {
    // eslint-disable-next-line functional/no-expression-statement
    yield a
  },
})

/**
 * @category Eq
 * @since 0.12.0
 */
export function getEq<A>(eq: EQ.Eq<A>): EQ.Eq<Iterable<A>> {
  return {
    equals: (fx, fy) => {
      const ify = fy[Symbol.iterator]()
      const ifx = fx[Symbol.iterator]()
      /* eslint-disable */
      let donex = false
      let doney = false

      while (!donex && !doney) {
        const ix = ifx.next()
        const iy = ify.next()

        donex = ix.done || false
        doney = iy.done || false

        if (!eq.equals(ix.value, iy.value)) {
          break
        }
      }

      return donex && doney
      /* eslint-enable */
    },
  }
}

/**
 * Takes an object that contains the iterable protocol anc coerces it into an
 * iterable.
 *
 * @category Interop
 * @since 0.12.0
 */
export function fromIterable<A, T extends Iterable<A>>(fa: T): Iterable<A> {
  return fa
}

/**
 * Loads all of the elements into memory by placing them all into a
 * `ReadonlyArray`.
 *
 * @category Destructors
 * @since 0.12.0
 */
export function toReadonlyArray<A>(fa: Iterable<A>): ReadonlyArray<A> {
  return Array.from(fa)
}

/**
 * @category FunctorWithIndex
 * @since 2.0.0
 */
export const mapWithIndex: <A, B>(
  f: (i: number, a: A) => B,
) => (fa: Iterable<A>) => Iterable<B> = f => fa => ({
  *[Symbol.iterator]() {
    // eslint-disable-next-line functional/no-let
    let i = 0
    // eslint-disable-next-line functional/no-loop-statement
    for (const a of fa) {
      // eslint-disable-next-line functional/no-expression-statement
      yield f(i++, a)
    }
  },
})

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.12.0
 */
export const map: <A, B>(f: (a: A) => B) => (fa: Iterable<A>) => Iterable<B> =
  f => mapWithIndex((i, a) => f(a))

/**
 * @category instances
 * @since 0.12.0
 */
export const Pointed: Pointed1<URI> = {
  URI,
  of,
}

/**
 * @category instances
 * @since 2.7.0
 */
export const FunctorWithIndex: FunctorWithIndex1<URI, number> = {
  URI,
  mapWithIndex: (fa, f) => mapWithIndex(f)(fa),
  map: (fa, f) => map(f)(fa),
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Apply: Apply1<URI> = {
  ...FunctorWithIndex,
  ap: (fab, fa) => ({
    *[Symbol.iterator]() {
      // eslint-disable-next-line functional/no-loop-statement
      for (const f of fab) {
        // eslint-disable-next-line functional/no-loop-statement
        for (const a of fa) {
          // eslint-disable-next-line functional/no-expression-statement
          yield f(a)
        }
      }
    },
  }),
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Applicative: Applicative1<URI> = {
  ...Apply,
  ...Pointed,
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Chain: Chain1<URI> = {
  ...Apply,
  chain: (fa, f) => ({
    *[Symbol.iterator]() {
      // eslint-disable-next-line functional/no-loop-statement
      for (const a of fa) {
        // eslint-disable-next-line functional/no-loop-statement
        for (const b of f(a)) {
          // eslint-disable-next-line functional/no-expression-statement
          yield b
        }
      }
    },
  }),
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Monad: Monad1<URI> = {
  ...Pointed,
  ...Chain,
}

export const Alt: Alt1<URI> = {
  ...FunctorWithIndex,
  alt: (fa, that) => ({
    *[Symbol.iterator]() {
      // eslint-disable-next-line functional/no-loop-statement
      for (const a of fa) {
        //eslint-disable-next-line functional/no-expression-statement
        yield a
      }

      // eslint-disable-next-line functional/no-loop-statement
      for (const a of that()) {
        //eslint-disable-next-line functional/no-expression-statement
        yield a
      }
    },
  }),
}

/**
 * @category instances
 * @since 2.7.0
 */
export const Zero: Zero1<URI> = {
  URI,
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  zero: () => ({ *[Symbol.iterator]() {} }),
}

const _filterMapWithIndex: FilterableWithIndex1<
  URI,
  number
>["filterMapWithIndex"] = (fa, f) => ({
  *[Symbol.iterator]() {
    // eslint-disable-next-line functional/no-let
    let i = 0
    // eslint-disable-next-line functional/no-loop-statement
    for (const a of fa) {
      const ob = f(i++, a)
      // eslint-disable-next-line functional/no-conditional-statement
      if (O.isSome(ob)) {
        //eslint-disable-next-line functional/no-expression-statement
        yield ob.value
      }
    }
  },
})

const _partitionMapWithIndex: FilterableWithIndex1<
  URI,
  number
>["partitionMapWithIndex"] = (fa, f) => ({
  left: _filterMapWithIndex(fa, (i, a) => pipe(f(i, a), E.swap, O.fromEither)),
  right: _filterMapWithIndex(fa, (i, a) => pipe(f(i, a), O.fromEither)),
})

/**
 * @category instances
 * @since 2.7.0
 */
export const Compactable: Compactable1<URI> = {
  URI,
  compact: fa => _filterMapWithIndex(fa, (i, a) => a),
  separate: fa => _partitionMapWithIndex(fa, (i, a) => a),
}

/**
 * @category instances
 * @since 2.7.0
 */
export const FilterableWithIndex: FilterableWithIndex1<URI, number> = {
  ...Compactable,
  ...FunctorWithIndex,
  filter: <A, B extends A>(
    fa: Iterable<A>,
    f: PredicateWithIndex<number, A> | RefinementWithIndex<number, A, B>,
  ) =>
    _filterMapWithIndex(fa, (i, a) =>
      pipe(
        a,
        O.fromPredicate(a => f(i, a)),
      ),
    ),
  filterWithIndex: <A, B extends A>(
    fa: Iterable<A>,
    f: PredicateWithIndex<number, A> | RefinementWithIndex<number, A, B>,
  ): Iterable<B> =>
    _filterMapWithIndex(fa, (i, a) =>
      pipe(
        a,
        O.fromPredicate((a): a is B => f(i, a)),
      ),
    ),
  filterMap: (fa, f) => _filterMapWithIndex(fa, (i, a) => f(a)),
  filterMapWithIndex: _filterMapWithIndex,
  partitionMapWithIndex: _partitionMapWithIndex,
  partitionMap: (fa, f) => _partitionMapWithIndex(fa, (i, a) => f(a)),
  partitionWithIndex: <A, B extends A>(
    fa: Iterable<A>,
    f: PredicateWithIndex<number, A> | RefinementWithIndex<number, A, B>,
  ) =>
    _partitionMapWithIndex(fa, (i, a) =>
      pipe(
        a,
        E.fromPredicate(
          a => f(i, a),
          e => e,
        ),
      ),
    ),
  partition: <A, B extends A>(
    fa: Iterable<A>,
    f: PredicateWithIndex<number, A> | RefinementWithIndex<number, A, B>,
  ) =>
    _partitionMapWithIndex(fa, (i, a) =>
      pipe(
        a,
        E.fromPredicate(
          a => f(i, a),
          e => e,
        ),
      ),
    ),
}

const _reduceWithIndex: FoldableWithIndex1<URI, number>["reduceWithIndex"] = (
  fa,
  b,
  f,
) => {
  // eslint-disable-next-line functional/no-let
  let i = 0
  // eslint-disable-next-line functional/no-let
  let m = b
  // eslint-disable-next-line functional/no-loop-statement
  for (const a of fa) {
    // eslint-disable-next-line functional/no-expression-statement
    m = f(i++, m, a)
  }
  return m
}

const _foldMapWithIndex: FoldableWithIndex1<URI, number>["foldMapWithIndex"] =
  M => (fa, f) =>
    _reduceWithIndex(fa, M.empty, (i, b, a) => M.concat(b, f(i, a)))

/**
 * @category instances
 * @since 2.7.0
 */
export const FoldableWithIndex: FoldableWithIndex1<URI, number> = {
  URI,
  foldMapWithIndex: _foldMapWithIndex,
  foldMap: M => (fa, f) => _foldMapWithIndex(M)(fa, (i, a) => f(a)),
  reduceWithIndex: _reduceWithIndex,
  reduce: (fa, b, f) => _reduceWithIndex(fa, b, (i, b, a) => f(b, a)),
  reduceRight: (fa, b, f) => pipe(fa, toReadonlyArray, A.reduceRight(b, f)),
  reduceRightWithIndex: (fa, b, f) =>
    pipe(fa, toReadonlyArray, A.reduceRightWithIndex(b, f)),
}

/**
 * Takes a function returning an `Option` and keeps it until it contains `None`.
 * The rest are removed.
 *
 * @category Combinators
 * @since 0.12.0
 */
export function takeWhileMapWithIndex<A, B extends A>(
  f: (i: number, a: A) => O.Option<B>,
) {
  return (fa: Iterable<A>): Iterable<B> => ({
    *[Symbol.iterator]() {
      // eslint-disable-next-line functional/no-let
      let i = 0
      // eslint-disable-next-line functional/no-loop-statement
      for (const a of fa) {
        const ob = f(i++, a)
        // eslint-disable-next-line functional/no-conditional-statement
        if (O.isSome(ob)) {
          // eslint-disable-next-line functional/no-expression-statement
          yield ob.value
        } else {
          break
        }
      }
    },
  })
}

/**
 * Takes a predicate and keeps each element until it returns false.
 * The rest are removed.
 *
 * @category Combinators
 * @since 0.12.0
 */
export function takeWhileWithIndex<A, B extends A>(
  f: PredicateWithIndex<number, A> | RefinementWithIndex<number, A, B>,
): (fa: Iterable<A>) => Iterable<B> {
  return takeWhileMapWithIndex((i, a) =>
    pipe(
      a,
      O.fromPredicate((a): a is B => f(i, a)),
    ),
  )
}

/**
 * Takes a predicate and keeps each element until it returns false.
 * The rest are removed.
 *
 * @category Combinators
 * @since 0.12.0
 */
export function takeWhile<A, B extends A>(
  f: Predicate<A> | Refinement<A, B>,
): (fa: Iterable<A>) => Iterable<B> {
  return takeWhileWithIndex<A, B>((i, a) => f(a))
}

/**
 * Takes up to `size` elements and removes the rest.
 *
 * @category Combinators
 * @since 0.12.0
 */
export function take(size: number): <A>(fa: Iterable<A>) => Iterable<A> {
  return takeWhileWithIndex(i => i < size)
}

/**
 * Takes a predicate and skips each element until it returns false.
 *
 * @category Combinators
 * @since 0.12.0
 */
export function skipWhileWithIndex<A>(f: PredicateWithIndex<number, A>) {
  return (fa: Iterable<A>): Iterable<A> => ({
    *[Symbol.iterator]() {
      // eslint-disable-next-line functional/no-let
      let i = 0
      // eslint-disable-next-line functional/no-let
      let take = false
      // eslint-disable-next-line functional/no-loop-statement
      for (const a of fa) {
        // eslint-disable-next-line functional/no-conditional-statement
        if (take) {
          // eslint-disable-next-line functional/no-expression-statement
          yield a
          // eslint-disable-next-line functional/no-conditional-statement
        } else if (!f(i++, a)) {
          // eslint-disable-next-line functional/no-expression-statement
          take = true
        }
      }
    },
  })
}

/**
 * Takes a predicate and skips each element until it returns false.
 *
 * @category Combinators
 * @since 0.12.0
 */
export function skipWhile<A>(
  f: Predicate<A>,
): (fa: Iterable<A>) => Iterable<A> {
  return skipWhileWithIndex((i, a) => f(a))
}

/**
 * Skips up to `size` elements and keeps the rest.
 *
 * @category Combinators
 * @since 0.12.0
 */
export function skip(count: number): <A>(fa: Iterable<A>) => Iterable<A> {
  return skipWhileWithIndex(i => i < count)
}
