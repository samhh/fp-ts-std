import { pipe, Predicate, Refinement, Endomorphism, flow } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { join } from './Array';

export const length = (x: string): number => x.length;

export const fromNumber = (x: number): string => String(x);

export const isString: Refinement<unknown, string> = (x): x is string => typeof x === 'string';

export const isEmpty: Predicate<string> = (x) => x === '';

export const contains = (substr: string): Predicate<string> => (target) =>
    target.includes(substr);

export const trim: Endomorphism<string> = (x) => x.trim();

export const trimLeft: Endomorphism<string> = (x) => x.trimLeft();

export const trimRight: Endomorphism<string> = (x) => x.trimRight();

export const concat = (x: string): Endomorphism<string> => (y) => x + y;

export const prepend = (prepended: string) => (rest: string): string => prepended + rest;

export const unprepend = (start: string) => (val: string): string => val.startsWith(start)
    ? val.substring(start.length)
    : val;

export const append = (appended: string) => (rest: string): string => rest + appended;

export const unappend = (end: string) => (val: string): string => val.endsWith(end)
    ? val.substring(0, val.lastIndexOf(end))
    : val;

export const surround = (x: string): Endomorphism<string> => flow(prepend(x), append(x));

export const unsurround = (start: string) => (end: string): Endomorphism<string> => val =>
    val.startsWith(start) && val.endsWith(end)
        ? pipe(val, unprepend(start), unappend(end))
        : val;

export const match = (r: RegExp) => (x: string): Option<RegExpMatchArray> =>
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    O.fromNullable(x.match(r));

export const split = (on: string | RegExp) => (target: string): Array<string> => target.split(on);

// The regex comes from here: https://stackoverflow.com/a/20056634
export const lines = split(/\r\n|\r|\n/);

export const unlines = join('\n');

export const test = (r: RegExp): Predicate<string> => x => r.test(x);

