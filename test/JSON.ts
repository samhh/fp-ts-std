import { stringifyPrimitive } from '../src/JSON';
import fc from 'fast-check';

describe('JSON', () => {
    describe('stringifyPrimitive', () => {
        it('never throws', () => {
            fc.assert(fc.property(
                fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null)),
                (x) => { stringifyPrimitive(x); },
            ));
        });
    });
});

