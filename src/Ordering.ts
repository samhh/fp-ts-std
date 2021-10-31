/**
 * Utilities to accommodate `fp-ts/Ordering`.
 *
 * @since 0.12.0
 */

import { Ordering } from "fp-ts/Ordering"

/**
 * Alias for the notion of "less than" in `Ordering`.
 *
 * @since 0.12.0
 */
export const LT: Ordering = -1

/**
 * Alias for the notion of "equal to" in `Ordering`.
 *
 * @since 0.12.0
 */
export const EQ: Ordering = 0

/**
 * Alias for the notion of "greater than" in `Ordering`.
 *
 * @since 0.12.0
 */
export const GT: Ordering = 1
