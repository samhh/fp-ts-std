/* eslint-disable functional/no-expression-statement */

import { lines, unlines, surround } from '../src/String';

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
});

