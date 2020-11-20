import { flip, withIndex, unary, applyTo, guard, ifElse } from "../src/Function"
import { prepend } from "../src/String"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import { add } from "../src/Number"
import { constant, constFalse, constTrue, Endomorphism } from "fp-ts/function"

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
        ])(constant("fallback"))(123),
      ).toBe("fallback")
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
})
