/* eslint-disable functional/no-expression-statement */

/**
 * Helpers for debugging applications during development. These should be
 * assumed to be unsafe and shouldn't make their way into production code.
 *
 * @since 0.2.0
 */

/**
 * Log the provided string to the console and immediately return the generic
 * argument. This is useful in the middle of `pipe`/`flow` chains.
 *
 * The trace function should only be used for debugging. The function is not
 * referentially transparent: its type indicates that it is a pure function but
 * it has the side effect of outputting the trace message.
 *
 * @since 0.2.0
 */
export const trace = (msg: string) => <A>(x: A): A => {
    console.log(msg);
    return x;
};

/**
 * Like `trace`, but logs the generic value too.
 *
 * @since 0.2.0
 */
export const traceWithValue = (msg: string) => <A>(x: A): A => {
    console.log(msg, x);
    return x;
};

