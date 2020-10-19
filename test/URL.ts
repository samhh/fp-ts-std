import { setParam } from '../src/URL';

describe('URL', () => {
    describe('setParam', () => {
        const f = setParam('x')('y');

        describe('returns updated data', () => {
            it('creates new property', () => {
                expect(f(new URLSearchParams())).toEqual(new URLSearchParams({ x: 'y' }));
            });

            it('updates preexisting property', () => {
                expect(f(new URLSearchParams({ x: 'z' }))).toEqual(new URLSearchParams({ x: 'y' }));
            });
        });

        it('does not mutate input', () => {
            const x = new URLSearchParams({ x: 'z' });
            const y = f(x);

            expect(x.get('x')).toBe('z');
            expect(y.get('x')).toBe('y');
        });
    });
});

