import { invert, and, or, xor, Bounded, Enum } from "../src/Boolean"
import { flow } from "fp-ts/function"
import * as O from "fp-ts/Option"

describe("Boolean", () => {
  describe("invert", () => {
    const f = invert

    it("inverts", () => {
      expect(f(true)).toBe(false)
      expect(f(false)).toBe(true)
    })
  })

  describe("and", () => {
    const f = and

    it("returns true for both true", () => {
      expect(f(true)(true)).toBe(true)
    })

    it("returns false for anything else", () => {
      expect(f(true)(false)).toBe(false)
      expect(f(false)(true)).toBe(false)
      expect(f(false)(false)).toBe(false)
    })
  })

  describe("or", () => {
    const f = or

    it("returns false for both false", () => {
      expect(f(false)(false)).toBe(false)
    })

    it("returns true for anything else", () => {
      expect(f(true)(true)).toBe(true)
      expect(f(true)(false)).toBe(true)
      expect(f(false)(true)).toBe(true)
    })
  })

  describe("xor", () => {
    const f = xor

    it("returns true for one true and one false", () => {
      expect(f(true)(false)).toBe(true)
      expect(f(false)(true)).toBe(true)
    })

    it("returns false for anything else", () => {
      expect(f(true)(true)).toBe(false)
      expect(f(false)(false)).toBe(false)
    })
  })

  describe("Bounded instance", () => {
    it("false is bottom", () => {
      expect(Bounded.bottom).toBe(false)
    })

    it("true is top", () => {
      expect(Bounded.top).toBe(true)
    })
  })

  describe("Enum instance", () => {
    it("considers true greater than false", () => {
      expect(Enum.succ(true)).toEqual(O.none)
      expect(Enum.succ(false)).toEqual(O.some(true))
      expect(Enum.pred(true)).toEqual(O.some(false))
      expect(Enum.pred(false)).toEqual(O.none)
    })

    describe("succ", () => {
      it("retracts pred", () => {
        const g = flow(Enum.pred, O.chain(Enum.succ), O.chain(Enum.pred))
        const h = Enum.pred

        expect(g(true)).toEqual(h(true))
        expect(g(false)).toEqual(h(false))
      })
    })

    describe("pred", () => {
      it("retracts succ", () => {
        const g = flow(Enum.succ, O.chain(Enum.pred), O.chain(Enum.succ))
        const h = Enum.succ

        expect(g(true)).toEqual(h(true))
        expect(g(false)).toEqual(h(false))
      })
    })

    describe("toEnum & fromEnum", () => {
      it("equivalent to partial isomorphism to binary 0 | 1", () => {
        expect(Enum.toEnum(-1)).toEqual(O.none)
        expect(Enum.toEnum(0)).toEqual(O.some(false))
        expect(Enum.toEnum(1)).toEqual(O.some(true))
        expect(Enum.toEnum(2)).toEqual(O.none)

        expect(Enum.fromEnum(true)).toBe(1)
        expect(Enum.fromEnum(false)).toBe(0)
      })
    })
  })
})
