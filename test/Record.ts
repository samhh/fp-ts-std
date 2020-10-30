import { values, lookupFlipped, pick, omit } from '../src/Record';
import * as O from 'fp-ts/Option';
import fc from 'fast-check';

describe('Record', () => {
    describe('values', () => {
        const f = values;

        it('gets object values', () => {
            expect(f({})).toEqual([]);
            expect(f({ a: 1 })).toEqual([1]);
            expect(f({ a: 1, b: ['two'] })).toEqual([1, ['two']]);
        });
    });

    describe('lookupFlipped', () => {
        const f = lookupFlipped;

        it('cannot find anything in empty object', () => {
            fc.assert(fc.property(
                fc.string(),
                x => O.isNone(f({})(x)),
            ));
        });

        it('finds matching key', () => {
            expect(f({ a: 1 })('a')).toEqual(O.some(1));
            expect(f({ a: ['two'], b: 'a' })('a')).toEqual(O.some(['two']));
        });
    });

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

        it('typechecks missing keys', () => {
            const before: Thing = { name: 'Ragnor', id: '789', foo: 'Bar' };
            const after: Omit<Thing, 'id'> = { name: 'Ragnor', foo: 'Bar' };

            expect(omit(['id', 'bar'])(before)).toEqual(after);
        });
    });
});

