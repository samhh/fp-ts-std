import { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, identity } from 'fp-ts/function';

export const stringify = <E>(f: (e: TypeError) => E) => (x: unknown): Either<E, string> =>
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    E.stringifyJSON(x, (e) => f(e as TypeError));

export const stringifyO = flow(stringify(identity), O.fromEither);

/**
 * Stringify a primitive value with no possibility of failure.
 */
export const stringifyPrimitive = (x: string | number | boolean | null | undefined): string =>
    JSON.stringify(x);

export const parse = <E>(f: (e: SyntaxError) => E) => (x: string): Either<E, unknown> =>
    // It should only throw some sort of `SyntaxError`:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    E.parseJSON(x, (e) => f(e as SyntaxError));

export const parseO = flow(parse(identity), O.fromEither);

