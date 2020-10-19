/**
 * @since 0.1.0
 */

import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';

/**
 * Unwrap the value from within an `Option`, throwing if `None`.
 *
 * @since 0.1.0
 */
export const unsafeUnwrap = <A>(x: Option<A>): A => {
    // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
    if (O.isNone(x)) throw 'Unsafe attempt to unwrap Option failed';

    return x.value;
};

