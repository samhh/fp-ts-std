/* eslint-disable functional/no-expression-statement */

import fc from 'fast-check';
import { ordNumber } from 'fp-ts/lib/Ord';
import { getInvertedOrd } from '../src/Ord';

describe('Ord', () => {
    describe('getInvertedOrd', () => {
        const f = ordNumber.compare;
        const g = getInvertedOrd(ordNumber).compare;

        it('inverts -1 and 1', () => {
            expect(f(2, 1)).toBe(1);
            expect(g(1, 2)).toBe(1);
            expect(f(1, 2)).toBe(-1);
            expect(g(2, 1)).toBe(-1);

            fc.assert(fc.property(
                fc.integer(), fc.integer(1, Number.MAX_SAFE_INTEGER),
                (x, y) => f(x, x - y) === 1 && g(x, x - y) === -1,
            ));
        });

        it('does not change 0', () => {
            expect(f(1, 1)).toBe(0);
            expect(g(1, 1)).toBe(0);

            fc.assert(fc.property(
                fc.integer(),
                (x) => f(x, x) === 0 && g(x, x) === 0,
            ));
        });
    });
});

