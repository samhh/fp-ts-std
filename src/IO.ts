/**
 * Utility functions to accommodate `fp-ts/IO`.
 *
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
export const tap =
  <A>(f: (x: A) => IO<void>) =>
  (x: A): IO<A> => {
    // eslint-disable-next-line functional/no-expression-statement
    f(x)()

    return IO.of(x)
  }

/**
 * Given a function, returns a new function that always returns the output
 * value of its first invocation.
 *
 * @example
 * import { once } from 'fp-ts-std/IO';
 * import * as IO from 'fp-ts/IO';
 * import { add } from 'fp-ts-std/Number';
 *
 * const f = once(add(5))
 *
 * assert.strictEqual(f(2)(), 7);
 * assert.strictEqual(f(3)(), 7);
 *
 * @since 0.7.0
 */
export const once = <A, B>(f: (x: A) => B): ((x: A) => IO<B>) => {
  const uncalled = Symbol()
  let val: typeof uncalled | B = uncalled // eslint-disable-line functional/no-let

  return x => {
    // eslint-disable-next-line functional/no-conditional-statement
    if (val === uncalled) val = f(x) // eslint-disable-line functional/no-expression-statement

    return IO.of(val)
  }
}
