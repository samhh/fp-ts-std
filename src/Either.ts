import { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';

/**
 * Unwrap the value from within an `Either`, throwing if `Left`.
 */
export const unsafeUnwrap = <A>(x: Either<unknown, A>): A => {
    // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
    if (E.isLeft(x)) throw 'Unsafe attempt to unwrap Either failed';

    return x.right;
};

