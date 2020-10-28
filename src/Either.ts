/**
 * @since 0.1.0
 */

import { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';

/**
 * Unwrap the value from within an `Either`, throwing if `Left`.
 *
 * @since 0.1.0
 */
export const unsafeUnwrap = <A>(x: Either<unknown, A>): A => {
    // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
    if (E.isLeft(x)) throw 'Unsafe attempt to unwrap Either failed';

    return x.right;
};

/**
 * Unwrap the value from within an `Either`, throwing if `Right`.
 *
 * @since 0.5.0
 */
export const unsafeUnwrapLeft = <E>(x: Either<E, unknown>): E => {
    // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
    if (E.isRight(x)) throw 'Unsafe attempt to unwrap Either failed';

    return x.left;
};

