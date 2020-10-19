/* eslint-disable functional/no-expression-statement */

import { lines } from './String';

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
});

