/**
 * @since 0.12.0
 */
import { eq as EQ } from "fp-ts"

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
