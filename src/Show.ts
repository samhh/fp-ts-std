/**
 * Utilities to accommodate `fp-ts/Show`.
 *
 * @since 0.12.0
 */

import { Contravariant1 } from "fp-ts/Contravariant"
import { Show } from "fp-ts/Show"
import { flow, pipe } from "fp-ts/function"

/**
 * Typeclass machinery.
 *
 * @category 4 Minutiae
 * @since 0.12.0
 */
export const URI = "Show"

/**
 * Typeclass machinery.
 *
 * @category 4 Minutiae
 * @since 0.12.0
 */
export type URI = typeof URI

declare module "fp-ts/HKT" {
	interface URItoKind<A> {
		readonly [URI]: Show<A>
	}
}

/**
 * Derive an instance for `Show<B>` by providing a function from `B` to `A` and
 * a `Show<A>` instance.
 *
 * @example
 * import { Show } from 'fp-ts/Show'
 * import * as Str from 'fp-ts/string'
 * import { contramap } from 'fp-ts-std/Show'
 *
 * const showNum: Show<number> = contramap(String)(Str.Show)
 *
 * assert.strictEqual(showNum.show(123), '"123"')
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const contramap =
	<B, A>(f: (b: B) => A) =>
	(m: Show<A>): Show<B> => ({ show: flow(f, m.show) })

/**
 * Formal `Contravariant` instance for `Show` to be provided to higher-kinded
 * functions that require it.
 *
 * @category 1 Typeclass Instances
 * @since 0.12.0
 */
export const Contravariant: Contravariant1<URI> = {
	URI,
	contramap: (m, f) => pipe(m, contramap(f)),
}
