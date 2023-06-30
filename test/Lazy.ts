import * as laws from "fp-ts-laws"
import fc from "fast-check"
import * as Lazy from "../src/Lazy.js"
import { flow, pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as E from "fp-ts/Either"
import * as Eq from "fp-ts/Eq"
import { increment } from "../src/Number.js"
import { fromNumber } from "../src/String.js"

const apply = <A>(f: Lazy.Lazy<A>): A => f()
const getEq = Eq.contramap(apply)
const getArb = <A>(x: fc.Arbitrary<A>): fc.Arbitrary<Lazy.Lazy<A>> =>
  x.map(Lazy.of)

describe("Lazy", () => {
  describe("Functor instance", () => {
    it("maps output", () => {
      expect(pipe(Lazy.of(3), Lazy.map(increment), apply)).toBe(4)
    })

    it("is lawful", () => {
      laws.functor(Lazy.Functor)(getArb, getEq)
    })
  })

  describe("Apply instance", () => {
    it("applies lifted function", () => {
      expect(pipe(Lazy.of(increment), Lazy.ap(Lazy.of(3)), apply)).toBe(4)
    })

    it("is lawful", () => {
      laws.apply(Lazy.Apply)(getArb, getEq)
    })
  })

  describe("Applicative instance", () => {
    it("is lawful", () => {
      laws.applicative(Lazy.Applicative)(getArb, getEq)
    })
  })

  describe("Monad instance", () => {
    it("maps and flattens output", () => {
      expect(
        pipe(Lazy.of(3), Lazy.chain(flow(increment, Lazy.of)), apply),
      ).toBe(4)
    })

    it("is lawful", () => {
      laws.monad(Lazy.Monad)(getEq)
    })
  })

  describe("ChainRec instance", () => {
    it("is stack safe", () => {
      const f = (n: number) =>
        n < 15000
          ? Lazy.of(E.left(n + 1))
          : Lazy.of(E.right("ok " + fromNumber(n)))
      expect(Lazy.ChainRec.chainRec(0, f)()).toBe("ok 15000")
    })
  })

  describe("traverseReadonlyNonEmptyArrayWithIndex", () => {
    const f = Lazy.traverseReadonlyNonEmptyArrayWithIndex((i, x: number) =>
      Lazy.of(i + x),
    )

    it("traverses non-empty array", () => {
      expect(pipe([1, 2, 3], f, apply)).toEqual([1, 3, 5])
    })
  })

  describe("traverseReadonlyArrayWithIndex", () => {
    const f = Lazy.traverseReadonlyArrayWithIndex((i, x: number) =>
      Lazy.of(i + x),
    )

    it("returns identity on empty input", () => {
      expect(pipe([], f, apply)).toEqual([])
    })

    it("traverses non-empty array", () => {
      expect(pipe([1, 2, 3], f, apply)).toEqual([1, 3, 5])
    })
  })

  describe("traverseArrayWithIndex", () => {
    const f = Lazy.traverseArrayWithIndex((i, x: number) => Lazy.of(i + x))

    it("returns identity on empty input", () => {
      expect(pipe([], f, apply)).toEqual([])
    })

    it("traverses non-empty array", () => {
      expect(pipe([1, 2, 3], f, apply)).toEqual([1, 3, 5])
    })
  })

  describe("traverseArray", () => {
    const f = Lazy.traverseArray(flow(increment, Lazy.of))

    it("returns identity on empty input", () => {
      expect(pipe([], f, apply)).toEqual([])
    })

    it("traverses non-empty array", () => {
      expect(pipe([1, 2, 3], f, apply)).toEqual([2, 3, 4])
    })
  })

  describe("sequeceArray", () => {
    const f = Lazy.sequenceArray

    it("returns identity on empty input", () => {
      expect(pipe([], f, apply)).toEqual([])
    })

    it("traverses non-empty array", () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), xs =>
          expect(pipe(xs, A.map(Lazy.of), f, apply)).toEqual(xs),
        ),
      )
    })
  })

  describe("execute", () => {
    it("gets the value", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(x).toEqual(pipe(x, Lazy.of, Lazy.execute)),
        ),
      )
    })
  })

  describe("lazy", () => {
    it("constructs ordinary Lazy value", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(
            pipe(
              Lazy.lazy(() => x),
              Lazy.execute,
            ),
          ).toEqual(pipe(() => x, Lazy.execute)),
        ),
      )
    })
  })

  /* eslint-disable */
  describe("memoize", () => {
    const f = Lazy.memoize

    it("does not rerun the input function", () => {
      let i = 0
      const g = f(() => i++)

      g()
      g()
      g()

      expect(i).toBe(1)
    })
  })
  /* eslint-enable */
})
