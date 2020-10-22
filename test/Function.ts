import { flip, withIndex } from '../src/Function';
import { concat } from '../src/String';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import { add } from '../src/Number';

describe('Function', () => {
    describe('flip', () => {
        it('flips curried arguments', () => {
            expect(concat('x')('y')).toBe('xy');
            expect(flip(concat)('x')('y')).toBe('yx');
        });
    });

    describe('withIndex', () => {
        const f = withIndex<number, number, number>(A.map);
        const g = withIndex<number, boolean, number>(A.filter);
        const h = withIndex<number, Option<number>, number>(A.filterMap);

        it('supplies an iterating index starting at zero', () => {
            expect(f(i => () => i)([1, 2, 3])).toEqual([0, 1, 2]);
            expect(f(add)([1, 2, 3])).toEqual([1, 3, 5]);
            expect(g(i => () => i % 2 === 0)([1, 2, 3])).toEqual([1, 3]);
            expect(h(i => x => i % 2 === 0 ? O.some(x) : O.none)([1, 2, 3])).toEqual([1, 3]);
        });
    });
});

