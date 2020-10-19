import { flow, not, Predicate, Refinement } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

export const getTime = (x: Date): number => x.getTime();

export const toISOString = (x: Date): string => x.toISOString();

export const isDate: Refinement<unknown, Date> = (x): x is Date => x instanceof Date;

export const isValid: Predicate<Date> = flow(getTime, not(Number.isNaN));

export const unsafeParseDate = (x: string | number): Date => new Date(x);

export const parseDate = flow(unsafeParseDate, O.fromPredicate(isValid));

