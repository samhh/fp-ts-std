/**
 * Helpers for debugging applications during development. These should be
 * assumed to be unsafe and shouldn't make their way into production code.
 *
 * @since 0.2.0
 */

import { Show } from "fp-ts/Show"

/* eslint-disable functional/no-expression-statements */

/**
 * Log the provided string to the console and immediately return the generic
 * argument. This is useful in the middle of `pipe`/`flow` chains.
 *
 * The trace function should only be used for debugging. The function is not
 * referentially transparent: its type indicates that it is a pure function but
 * it has the side effect of outputting the trace message.
 *
 * @example
 * import { trace } from 'fp-ts-std/Debug'
 * import { flow } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * const toString = (n: number): string => String(n)
 *
 * // Will log: "my log message"
 * const doubledString: (n: number) => string =
 *     flow(double, trace('my log message'), toString)
 *
 * // Actual function/pipeline behaviour is unaffected:
 * assert.strictEqual(doubledString(2), '4')
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const trace =
  (msg: string) =>
  <A>(x: A): A => {
    console.log(msg)
    return x
  }

/**
 * Like `trace`, but logs the generic value too.
 *
 * @example
 * import { traceWithValue } from 'fp-ts-std/Debug'
 * import { flow } from 'fp-ts/function'
 *
 * const double = (n: number): number => n * 2
 * const toString = (n: number): string => String(n)
 *
 * // Will log: "my log message: <value>"
 * const doubledString: (n: number) => string =
 *     flow(double, traceWithValue('my log message: '), toString)
 *
 * // Actual function/pipeline behaviour is unaffected:
 * assert.strictEqual(doubledString(2), '4')
 *
 * @category 3 Functions
 * @since 0.2.0
 */
export const traceWithValue =
  (msg: string) =>
  <A>(x: A): A => {
    console.log(msg, x)
    return x
  }

/**
 * Like `traceWithValue`, but first processes the value via `Show`.
 *
 * @example
 * import { traceShowWithValue } from 'fp-ts-std/Debug'
 * import { flow } from 'fp-ts/function'
 * import * as Num from 'fp-ts/number'
 *
 * const double = (n: number): number => n * 2
 * const toString = (n: number): string => String(n)
 *
 * // Will log: "my log message: <Shown value>"
 * const doubledString: (n: number) => string =
 *     flow(double, traceShowWithValue(Num.Show)('my log message: '), toString)
 *
 * // Actual function/pipeline behaviour is unaffected:
 * assert.strictEqual(doubledString(2), '4')
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const traceShowWithValue =
  <A>(S: Show<A>) =>
  (msg: string) =>
  (x: A): A => {
    console.log(msg, S.show(x))
    return x
  }
