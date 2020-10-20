/* eslint-disable functional/no-expression-statement */

import { pluckFirst, upsert, getDisorderedEq } from '../src/Array';
import * as Option from 'fp-ts/Option';
import { contramap as eqContramap, eqNumber } from 'fp-ts/Eq';
import { contramap as ordContramap, ordNumber } from 'fp-ts/Ord';
import { Predicate } from 'fp-ts/function';
import fc from 'fast-check';

describe('Array', () => {
    describe('pluckFirst', () => {
        const p: Predicate<number> = x => x % 2 === 1;
        const f = pluckFirst(p);

        it('finds the item', () => {
            expect(f([2, 3, 4])).toEqual([Option.some(3), [2, 4]]);
        });

        it('does not "find" an incorrect item', () => {
            expect(f([2, 4, 6])).toEqual([Option.none, [2, 4, 6]]);
        });

        it('removes only the first, left-most match', () => {
            expect(f([2, 3, 4, 5])).toEqual([Option.some(3), [2, 4, 5]]);
        });

        it('does not mutate input', () => {
            const xs = [2, 3, 4];
            f(xs);
            expect(xs).toEqual([2, 3, 4]);
        });
    });

    describe('upsert', () => {
        type Thing = { id: number; name: string };
        const eqThing = eqContramap<number, Thing>(x => x.id)(eqNumber);

        const x1: Thing = { id: 1, name: 'x' };
        const x2: Thing = { id: 1, name: 'x2' };
        const y: Thing = { id: 2, name: 'y' };
        const z: Thing = { id: 3, name: 'z' };

        const f = upsert;
        const g = f(eqThing)(x2);

        it('appends non-present item', () => {
            expect(g([])).toEqual([x2]);
            expect(g([y, z])).toEqual([y, z, x2]);
        });

        it('updates present item in-place', () => {
            expect(g([x1, y])).toEqual([x2, y]);
            expect(g([y, x1])).toEqual([y, x2]);
        });

        it('does not mutate input', () => {
            const xs = [{ ...x1 }];
            g(xs);
            expect(xs).toEqual([{ ...x1 }]);
        });

        it('always returns a non-empty array', () => {
            fc.assert(fc.property(
                fc.array(fc.integer()), fc.integer(),
                (xs, y) => !!f(eqNumber)(y)(xs).length,
            ));
        });
    });

    describe('getDisorderedEq', () => {
        type Thing = { id: number; name: string };
        const ordThing = ordContramap<number, Thing>(x => x.id)(ordNumber);

        const y: Thing = { id: 1, name: 'x' };
        const z: Thing = { id: 2, name: 'y' };
        const zAlt: Thing = { id: 2, name: 'changed' };

        const f = getDisorderedEq(ordThing).equals;

        it('its equality using Eq', () => {
            expect(f([], [])).toBe(true);
            expect(f([y], [y])).toBe(true);
            expect(f([z], [zAlt])).toBe(true);
            expect(f([y, z], [y, z])).toBe(true);
            expect(f([y, y], [y, z])).toBe(false);
            expect(f([y, y], [y])).toBe(false);
        });

        it('disregards initial indices', () => {
            expect(f([y, z], [z, y])).toBe(true);
        });
    });
});

