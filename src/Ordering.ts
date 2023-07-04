/**
 * Utilities to accommodate `fp-ts/Ordering`.
 *
 * @since 0.12.0
 */

import { Ordering } from "fp-ts/lib/Ordering.js"

/**
 * Alias for the notion of "less than" in `Ordering`.
 *
 * @example
 * import { Ord } from 'fp-ts/number'
 * import { LT } from 'fp-ts-std/Ordering'
 *
 * assert.strictEqual(Ord.compare(0, 1), LT)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const LT: Ordering = -1

/**
 * Alias for the notion of "equal to" in `Ordering`.
 *
 * @example
 * import { Ord } from 'fp-ts/number'
 * import { EQ } from 'fp-ts-std/Ordering'
 *
 * assert.strictEqual(Ord.compare(0, 0), EQ)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const EQ: Ordering = 0

/**
 * Alias for the notion of "greater than" in `Ordering`.
 *
 * @example
 * import { Ord } from 'fp-ts/number'
 * import { GT } from 'fp-ts-std/Ordering'
 *
 * assert.strictEqual(Ord.compare(1, 0), GT)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const GT: Ordering = 1
