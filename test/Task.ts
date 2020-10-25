/* eslint-disable functional/no-expression-statement */

import { sleep } from '../src/Task';

const flushPromises = () => new Promise(setImmediate);

describe('Task', () => {
    describe('sleep', () => {
        it('waits the specified period of time', async () => {
            jest.useFakeTimers();

            const spy = jest.fn();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            sleep(1000)().then(spy);

            expect(spy).not.toHaveBeenCalled();

            jest.advanceTimersByTime(999);
            await flushPromises();

            expect(spy).not.toHaveBeenCalled();

            jest.advanceTimersByTime(1);
            await flushPromises();

            expect(spy).toHaveBeenCalled();

            jest.useRealTimers();
        });
    });
});

