import { add, multiply, subtract, divide } from '../src/Number';

describe('Number', () => {
    describe('add', () => {
        it('adds', () => {
            expect(add(5)(-3)).toBe(2);
        });
    });

    describe('multiply', () => {
        it('multiplies', () => {
            expect(multiply(5)(-3)).toBe(-15);
        });
    });

    describe('subtract', () => {
        it('subtracts the first number from the second', () => {
            expect(subtract(5)(7)).toBe(2);
        });
    });

    describe('divide', () => {
        it('divides the second number by the first', () => {
            expect(divide(5)(15)).toBe(3);
        });
    });
});

