/**
 * @since 0.7.0
 */

import * as IO from "fp-ts/IO"

type IO<A> = IO.IO<A>

/**
 * Performs the side effect with the input value and then returns said input
 * value.
 *
 * @example
 * import { tap } from 'fp-ts-std/IO';
 * import * as IO from 'fp-ts/IO';
 * import { flow } from 'fp-ts/function';
 *
 * let x = 0;
 * const mutate = (y: number): IO.IO<void> => () => { x = y }
 *
 * const double = (n: number): number => n * 2;
 * const toString = (n: number): string => String(n);
 *
 * const doubledString: (n: number) => IO.IO<string> =
 *     flow(double, tap(mutate), IO.map(toString));
 *
 * assert.strictEqual(x, 0);
 * assert.strictEqual(doubledString(2)(), '4');
 * assert.strictEqual(x, 4);
 *
 * @since 0.7.0
 */
export const tap = <A>(f: (x: A) => IO<void>) => (x: A): IO<A> => {
  // eslint-disable-next-line functional/no-expression-statement
  f(x)()

  return IO.of(x)
}
