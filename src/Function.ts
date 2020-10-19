/**
 * @since 0.1.0
 */

/**
 * Flip the function/argument order of a curried function.
 *
 * Note that due to limitations to the type system, this function won't work
 * correctly for curried functions.
 *
 * @since 0.1.0
 */
export const flip = <
    A extends Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    B extends Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    C,
// eslint-disable-next-line functional/functional-parameters
>(f: (...a: A) => (...b: B) => C) => (...b: B) => (...a: A): C => f(...a)(...b);

