/**
 * Polymorphic functions for `newtype-ts`.
 *
 * **Warning**: These functions will allow you to break the contracts of
 * newtypes behind smart constructors.
 *
 * @since 0.15.0
 */

import { Endomorphism } from "fp-ts/Endomorphism"
import { Functor, Functor1, Functor2, Functor3, Functor4 } from "fp-ts/Functor"
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
import * as Id from "fp-ts/Identity"
import { pipe } from "fp-ts/function"
import { Newtype, iso } from "newtype-ts"

/**
 * Pack a value into a newtype.
 *
 * @example
 * import { pack } from 'fp-ts-std/Newtype'
 * import { Milliseconds, mkMilliseconds } from 'fp-ts-std/Date'
 *
 * assert.strictEqual(
 *   pack<Milliseconds>(123),
 *   mkMilliseconds(123),
 * )
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const pack = <A extends Newtype<unknown, unknown> = never>(x: A["_A"]) =>
	iso<A>().wrap(x)

/**
 * Unpack a value from a newtype.
 *
 * @example
 * import { unpack } from 'fp-ts-std/Newtype'
 * import { mkMilliseconds } from 'fp-ts-std/Date'
 *
 * assert.strictEqual(
 *   unpack(mkMilliseconds(123)),
 *   123,
 * )
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const unpack = <A extends Newtype<unknown, unknown>>(x: A): A["_A"] =>
	iso<A>().unwrap(x)

/**
 * Apply a effectful function over a newtype.
 *
 * @example
 * import { overF } from 'fp-ts-std/Newtype'
 * import * as O from 'fp-ts/Option'
 * import { Milliseconds, mkMilliseconds } from 'fp-ts-std/Date'
 *
 * const filterLongEnough =
 *   overF(O.Functor)<number>(O.fromPredicate(n => n > 1000))<Milliseconds>
 *
 * assert.deepStrictEqual(filterLongEnough(mkMilliseconds(500)), O.none)
 * assert.deepStrictEqual(filterLongEnough(mkMilliseconds(1500)), O.some(mkMilliseconds(1500)))
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export function overF<F extends URIS4>(
	F: Functor4<F>,
): <S, R, E, A>(
	f: (x: A) => Kind4<F, S, R, E, A>,
) => <B extends Newtype<unknown, A>>(x: B) => Kind4<F, S, R, E, B>
export function overF<F extends URIS3>(
	F: Functor3<F>,
): <R, E, A>(
	f: (x: A) => Kind3<F, R, E, A>,
) => <B extends Newtype<unknown, A>>(x: B) => Kind3<F, R, E, B>
export function overF<F extends URIS2>(
	F: Functor2<F>,
): <E, A>(
	f: (x: A) => Kind2<F, E, A>,
) => <B extends Newtype<unknown, A>>(x: B) => Kind2<F, E, B>
export function overF<F extends URIS>(
	F: Functor1<F>,
): <A>(
	f: (x: A) => Kind<F, A>,
) => <B extends Newtype<unknown, A>>(x: B) => Kind<F, B>
export function overF<F>(
	F: Functor<F>,
): <A>(
	f: (x: A) => HKT<F, A>,
) => <B extends Newtype<unknown, A>>(x: B) => HKT<F, B>
export function overF<F>(
	F: Functor<F>,
): <A>(
	f: (x: A) => HKT<F, A>,
) => <B extends Newtype<unknown, A>>(x: B) => HKT<F, B> {
	return <A>(f: (x: A) => HKT<F, A>) =>
		<B extends Newtype<unknown, A>>(x: B) =>
			pipe(x, unpack, f, y => F.map(y, pack<B>))
}

/**
 * Apply an endomorphism over a newtype. Similar to functor map, but for
 * newtypes.
 *
 * @example
 * import { over } from 'fp-ts-std/Newtype'
 * import { mkMilliseconds } from 'fp-ts-std/Date'
 * import { multiply } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(
 *   over(multiply(2))(mkMilliseconds(3)),
 *   mkMilliseconds(6),
 * )
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const over: <A>(
	f: Endomorphism<A>,
) => <B extends Newtype<unknown, A>>(x: B) => B = overF(Id.Functor)
