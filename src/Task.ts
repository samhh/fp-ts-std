/**
 * @since 0.1.0
 */
import { Task } from 'fp-ts/Task';

/**
 * Wait for the specified number of milliseconds before resolving.
 *
 * @since 0.1.0
 */
export const sleep = (ms: number): Task<void> => () => new Promise<void>((resolve) => {
    // eslint-disable-next-line functional/no-expression-statement
    setTimeout(resolve, Math.floor(ms));
});

