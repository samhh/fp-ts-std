import { Task } from 'fp-ts/Task';

export const sleep = (ms: number): Task<void> => () => new Promise<void>((resolve) => {
    // eslint-disable-next-line functional/no-expression-statement
    setTimeout(resolve, Math.floor(ms));
});

