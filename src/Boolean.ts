/**
 * @since 0.1.0
 */

import { Endomorphism } from 'fp-ts/function';

/**
 * Invert a boolean.
 *
 * @since 0.4.0
 */
export const invert: Endomorphism<boolean> = x => !x;

