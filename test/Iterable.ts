import { iterable } from "../src"
import { readonlyArray as A, string as String } from "fp-ts"
import * as fc from "fast-check"
import * as laws from "fp-ts-laws"
import { pipe, tuple } from "fp-ts/lib/function"

describe("iterable", () => {
  describe("destructors", () => {
    it("toReadonlyArray", () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), ix => {
          expect(
            iterable.toReadonlyArray(iterable.fromIterable(ix)),
          ).toStrictEqual(ix)
        }),
      )
    })
  })

  describe("typeclasses", () => {
    describe("Eq", () => {
      it("getEq", () => {
        const eq = iterable.getEq(String.Eq)
        // eslint-disable-next-line
        laws.eq(eq, fc.array(fc.string()))
      })
    })

    describe("Apply", () => {
      it("laws", () => {
        laws.apply(iterable.Apply)(a => a.map(iterable.of), iterable.getEq)
      })
    })

    describe("Applicative", () => {
      it("laws", () => {
        laws.applicative(iterable.Applicative)(
          a => a.map(iterable.of),
          iterable.getEq,
        )
      })
    })

    describe("Chain", () => {
      it("laws", () => {
        laws.monad(iterable.Monad)(iterable.getEq)
      })
    })

    describe("Pointed", () => {
      it("of", () => {
        fc.assert(
          fc.property(fc.integer(), i => {
            const result = pipe(iterable.of(i), iterable.toReadonlyArray)
            expect(result).toStrictEqual([i])
          }),
        )
      })
    })

    describe("FunctorWithIndex", () => {
      it("laws", () => {
        laws.functor(iterable.FunctorWithIndex)(
          arbitrary => arbitrary.map(a => iterable.of(a)),
          e => iterable.getEq(e),
        )
      })

      // this for code coverage, which I can't seem to figure out how to ignore
      it("mapWithIndex", () => {
        fc.assert(
          fc.property(fc.array(fc.integer()), ix => {
            const result = pipe(
              iterable.FunctorWithIndex.mapWithIndex(
                iterable.fromIterable(ix),
                (i, a) => tuple(a, i),
              ),
              iterable.toReadonlyArray,
            )

            const expected = pipe(
              ix,
              A.mapWithIndex((i, a) => tuple(a, i)),
            )

            expect(result).toStrictEqual(expected)
          }),
        )
      })
    })

    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    describe("Compactable", () => {})
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    describe("FilterableWithIndex", () => {})
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    describe("FoldableWithIndex", () => {})
  })
})
