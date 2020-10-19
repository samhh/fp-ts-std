/* eslint-disable functional/no-expression-statement */

import { pick, omit } from './Record';

describe('Record', () => {
    describe('pick', () => {
        type Thing = { name: string; age: number };
        const x: Thing = { name: 'Hodor', age: 123 };

        it('picks no keys', () => {
            expect(pick<Thing>()([])(x)).toEqual({});
        });

        it('picks individual keys', () => {
            expect(pick<Thing>()(['name'])(x)).toEqual({ name: 'Hodor' });
            expect(pick<Thing>()(['age'])(x)).toEqual({ age: 123 });
        });

        it('picks multiple keys', () => {
            expect(pick<Thing>()(['name', 'age'])(x)).toEqual(x);
        });
    });

    describe('omit', () => {
        type Thing = { name: string; id: string; foo: string };

        it('omits multiple keys', () => {
            const before: Thing = { name: 'Ragnor', id: '789', foo: 'Bar' };
            const after: Omit<Thing, 'id' | 'foo'> = { name: 'Ragnor' };

            expect(omit(['id', 'foo'])(before)).toEqual(after);
        });
    });
});

