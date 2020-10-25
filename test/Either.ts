import { unsafeUnwrap } from '../src/Either';
import * as E from 'fp-ts/Either';

describe('Either', () => {
    describe('unsafeUnwrap', () => {
        const f = unsafeUnwrap;

        it('unwraps Right', () => {
            expect(f(E.right(123))).toBe(123);
        });

        it('throws Left', () => {
            expect(() => f(E.left(undefined))).toThrow();
        });
    });
});

