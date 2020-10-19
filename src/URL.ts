import * as IO from 'fp-ts/IO';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';
import { flow, identity, pipe, Refinement } from 'fp-ts/function';

export const unsafeParse = (x: string): URL => new URL(x);

export const parse = <E>(f: (e: TypeError) => E) => (x: string): Either<E, URL> => pipe(
    // It should only throw some sort of `TypeError`:
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    E.tryCatch(() => unsafeParse(x), (e) => f(e as TypeError)),
);

export const parseO = flow(parse(identity), O.fromEither);

export const isURL: Refinement<unknown, URL> = (x): x is URL => x instanceof URL;

export const isURLSearchParams: Refinement<unknown, URLSearchParams> = (x): x is URLSearchParams =>
    x instanceof URLSearchParams;

export const getParam = (k: string) => (ps: URLSearchParams): IO.IO<Option<string>> => pipe(
    ps.get(k),
    O.fromNullable,
    IO.of,
);

export const setParam = (k: string) => (v: string) => (ps: URLSearchParams): IO.IO<void> => pipe(
    ps.set(k, v),
    IO.of,
);

