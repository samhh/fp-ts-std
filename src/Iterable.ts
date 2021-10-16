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
