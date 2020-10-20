/* eslint-disable functional/no-expression-statement */

import { lines, unlines, surround, startsWith, endsWith, takeLeft, takeRight } from '../src/String';
import fc from 'fast-check';

describe('String', () => {
    describe('lines', () => {
        const f = lines;

        it('splits on \\n newlines', () => {
            expect(f('')).toEqual(['']);
            expect(f('\n')).toEqual(['', '']);
            expect(f('\n\n')).toEqual(['', '', '']);
            expect(f('\na')).toEqual(['', 'a']);
            expect(f('a\n')).toEqual(['a', '']);
            expect(f('a\nb')).toEqual(['a', 'b']);
        });

        it('splits on \\r newlines', () => {
            expect(f('')).toEqual(['']);
            expect(f('\r')).toEqual(['', '']);
            expect(f('\r\r')).toEqual(['', '', '']);
            expect(f('\ra')).toEqual(['', 'a']);
            expect(f('a\r')).toEqual(['a', '']);
            expect(f('a\rb')).toEqual(['a', 'b']);
        });

        it('splits on \\r\\n newlines', () => {
            expect(f('')).toEqual(['']);
            expect(f('\r\n')).toEqual(['', '']);
            expect(f('\r\n\r\n')).toEqual(['', '', '']);
            expect(f('\r\na')).toEqual(['', 'a']);
            expect(f('a\r\n')).toEqual(['a', '']);
            expect(f('a\r\nb')).toEqual(['a', 'b']);
        });
    });

    describe('unlines', () => {
        const f = unlines;

        it('morphs empty array to empty string', () => {
            expect(f([])).toBe('');
        });

        it('extracts single string out of array', () => {
            expect(f(['a'])).toBe('a');
        });

        it('joins array of strings with newlines', () => {
            expect(f(['a', 'b', 'c'])).toBe('a\nb\nc');
        });
    });

    describe('surround', () => {
        const f = surround;

        it('surrounds empty with empty', () => {
            expect(f('')('')).toBe('');
        });

        it('surrounds empty with non-empty', () => {
            expect(f('x')('')).toBe('xx');
        });

        it('surrounds non-empty with empty', () => {
            expect(f('')('x')).toBe('x');
        });

        it('surrounds non-empty with non-empty', () => {
            expect(f('x')('y')).toBe('xyx');
        });
    });

    describe('startsWith', () => {
        const f = startsWith;

        it('returns true for empty substring', () => {
            fc.assert(fc.property(
                fc.string(),
                x => f('')(x),
            ));
        });

        it('checks start of string for substring', () => {
            expect(f('x')('xyz')).toBe(true);
            expect(f('a')('xyz')).toBe(false);

            fc.assert(fc.property(
                fc.string(), fc.string(),
                (x, y) => f(x)(x + y),
            ));
        });
    });

    describe('endsWith', () => {
        const f = endsWith;

        it('returns true for empty substring', () => {
            fc.assert(fc.property(
                fc.string(),
                x => f('')(x),
            ));
        });

        it('checks end of string for substring', () => {
            expect(f('z')('xyz')).toBe(true);
            expect(f('a')('xyz')).toBe(false);

            fc.assert(fc.property(
                fc.string(), fc.string(),
                (x, y) => f(x)(y + x),
            ));
        });
    });

    describe('takeLeft', () => {
        const f = takeLeft;

        it('takes the specified number of characters from the start', () => {
            expect(f(2)('abc')).toBe('ab');
        });

        it('returns empty string for non-positive number', () => {
            fc.assert(fc.property(
                fc.integer(0), fc.string(),
                (n, x) => f(n)(x) === '',
            ));
        });

        it('returns whole string for number that\'s too large', () => {
            fc.assert(fc.property(
                fc.string(), fc.integer(0, Number.MAX_SAFE_INTEGER),
                (x, n) => f(x.length + n)(x) === x,
            ));
        });

        it('rounds float input down to nearest int', () => {
            const x = 'abc';

            expect(f(0.1)(x)).toBe('');
            expect(f(0.9)(x)).toBe('');
            expect(f(1.1)(x)).toBe('a');
        });
    });

    describe('takeRight', () => {
        const f = takeRight;

        it('takes the specified number of characters from the end', () => {
            expect(f(2)('abc')).toBe('bc');
        });

        it('returns empty string for non-positive number', () => {
            fc.assert(fc.property(
                fc.integer(0), fc.string(),
                (n, x) => f(n)(x) === '',
            ));
        });

        it('returns whole string for number that\'s too large', () => {
            fc.assert(fc.property(
                fc.string(), fc.integer(0, Number.MAX_SAFE_INTEGER),
                (x, n) => f(x.length + n)(x) === x,
            ));
        });

        it('rounds float input down to nearest int', () => {
            const x = 'abc';

            expect(f(0.1)(x)).toBe('');
            expect(f(0.9)(x)).toBe('');
            expect(f(1.1)(x)).toBe('c');
        });
    });
});

