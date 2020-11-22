import {
  flip,
  withIndex,
  unary,
  applyTo,
  guard,
  ifElse,
  unless,
  when,
  until,
  construct,
  memoize,
} from "../src/Function"
import { fromNumber, prepend } from "../src/String"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import { add, multiply } from "../src/Number"
import { constant, constFalse, constTrue, Endomorphism } from "fp-ts/function"
import { eqNumber } from "fp-ts/Eq"
import fc from "fast-check"

describe("Function", () => {
  describe("flip", () => {
    it("flips curried arguments", () => {
      expect(prepend("x")("y")).toBe("xy")
      expect(flip(prepend)("x")("y")).toBe("yx")
    })
  })

  describe("withIndex", () => {
    const f = withIndex<number, number, number>(A.map)
    const g = withIndex<number, boolean, number>(A.filter)
    const h = withIndex<number, Option<number>, number>(A.filterMap)

    it("supplies an iterating index starting at zero", () => {
      expect(f(i => () => i)([1, 2, 3])).toEqual([0, 1, 2])
      expect(f(add)([1, 2, 3])).toEqual([1, 3, 5])
      expect(g(i => () => i % 2 === 0)([1, 2, 3])).toEqual([1, 3])
      expect(
        h(i => x => (i % 2 === 0 ? O.some(x) : O.none))([1, 2, 3]),
      ).toEqual([1, 3])
    })
  })

  describe("unary", () => {
    const f = unary(Math.max)

    it("spreads the array input over the function", () => {
      const xs = [1, 3, 2]

      // @ts-expect-error ensure it doesn't work without our unary helper
      expect(Math.max(xs)).toBeNaN()
      expect(f(xs)).toBe(3)
    })
  })

  describe("applyTo", () => {
    const f = applyTo

    it("applies the function", () => {
      const g: Endomorphism<number> = n => n * 2

      expect(f(5)(g)).toBe(g(5))
    })
  })

  describe("guard", () => {
    const f = guard

    it("returns fallback if all predicates fail", () => {
      expect(f<number, string>([])(constant("fallback"))(123)).toBe("fallback")

      expect(
        f<number, string>([
          [constFalse, constant("x")],
          [constFalse, constant("y")],
          [constFalse, constant("z")],
        ])(fromNumber)(123),
      ).toBe("123")
    })

    it("returns the morphism output from the first successful predicate", () => {
      expect(
        f<number, string>([
          [n => n === 122, constant("x")],
          [n => n === 123, constant("y")],
          [n => n === 123, constant("z")],
        ])(constant("fallback"))(123),
      ).toBe("y")
    })
  })

  describe("ifElse", () => {
    const f = ifElse
    const g = f(constant(1))(constant(2))

    it("applies first function if predicate succeeds", () => {
      expect(g(constTrue)(null)).toBe(1)
    })

    it("applies second function if predicate fails", () => {
      expect(g(constFalse)(null)).toBe(2)
    })
  })

  describe("unless", () => {
    const f = flip(unless)(multiply(2))

    it("returns identity on input if predicate succeeds", () => {
      expect(f(constTrue)(5)).toBe(5)
    })

    it("applies function to input if predicate fails", () => {
      expect(f(constFalse)(5)).toBe(10)
    })
  })

  describe("when", () => {
    const f = flip(when)(multiply(2))

    it("applies function to input if predicate succeeds", () => {
      expect(f(constTrue)(5)).toBe(10)
    })

    it("returns identity on input if predicate fails", () => {
      expect(f(constFalse)(5)).toBe(5)
    })
  })

  describe("until", () => {
    const f = until<number>(n => n > 5)(n => n * 2)

    it("never applies function if predicate already holds", () => {
      expect(f(7)).toBe(7)
    })

    it("applies function until predicate holds", () => {
      expect(f(1)).toBe(8)
    })
  })

  describe("construct", () => {
    const f = construct

    // eslint-disable-next-line functional/no-class
    class X {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      constructor(public x: number, public y: string) {}
    }

    it("instantiates and passes on constructor arguments", () => {
      const xs: [number, string] = [123, "xyz"]

      expect(f(X)(xs)).toEqual(new X(...xs))
      expect(f(X)(xs).x).toBe(123)
      expect(f(X)(xs).y).toBe("xyz")
    })
  })

  describe("memoize", () => {
    const f = memoize

    it("always returns the same output provided same input", () => {
      const g = f(eqNumber)(add(5))

      expect(g(2)).toBe(7)
      expect(g(3)).toBe(8)
      expect(g(2)).toBe(7)

      fc.assert(fc.property(fc.integer(), n => g(n) === n + 5))
    })

    it("does not call function more than once per input", () => {
      let runs = 0 // eslint-disable-line functional/no-let
      const g = f(eqNumber)<number>(n => {
        runs++ // eslint-disable-line functional/no-expression-statement
        return add(5)(n)
      })

      expect(runs).toBe(0)
      expect(g(2)).toBe(7)
      expect(runs).toBe(1)
      expect(g(3)).toBe(8)
      expect(runs).toBe(2)
      expect(g(2)).toBe(7)
      expect(runs).toBe(2)
    })

    it("does not cross-pollute", () => {
      const g = f(eqNumber)(add(5))
      const h = f(eqNumber)(add(15))

      expect(g(2)).toBe(7)
      expect(h(2)).toBe(17)
      expect(g(3)).toBe(8)
      expect(h(3)).toBe(18)
      expect(g(2)).toBe(7)
      expect(h(2)).toBe(17)
    })
  })
})
