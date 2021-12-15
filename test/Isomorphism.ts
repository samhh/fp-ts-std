import fc from "fast-check"
import * as laws from "fp-ts-laws"
import {
  Isomorphism,
  toIso,
  fromIso,
  reverse,
  deriveSemigroup,
} from "../src/Isomorphism"
import { Iso } from "monocle-ts/Iso"
import * as Eq from "fp-ts/Eq"
import * as Bool from "fp-ts/boolean"

describe("Isomorphism", () => {
  type Binary = 0 | 1
  const toBinary = (x: boolean): Binary => (x ? 1 : 0)
  const fromBinary: (x: Binary) => boolean = Boolean
  const isoF: Isomorphism<boolean, Binary> = {
    to: toBinary,
    from: fromBinary,
  }
  const isoM: Iso<boolean, Binary> = {
    get: toBinary,
    reverseGet: fromBinary,
  }

  describe("toIso", () => {
    it("performs simple key transformation", () => {
      expect(toIso(isoF)).toEqual(isoM)
    })
  })

  describe("fromIso", () => {
    it("performs simple key transformation", () => {
      expect(fromIso(isoM)).toEqual(isoF)
    })
  })

  describe("reverse", () => {
    it("performs simple key transformation", () => {
      expect(reverse(isoF)).toEqual({
        to: fromBinary,
        from: toBinary,
      })
    })
  })

  describe("deriveSemigroup", () => {
    const f = deriveSemigroup

    it("uses provided Semigroup instance", () => {
      const SAll = f(isoF)(Bool.SemigroupAll)
      expect(SAll.concat(0, 0)).toBe(0)
      expect(SAll.concat(0, 1)).toBe(0)
      expect(SAll.concat(1, 0)).toBe(0)
      expect(SAll.concat(1, 1)).toBe(1)

      const SAny = f(isoF)(Bool.SemigroupAny)
      expect(SAny.concat(0, 0)).toBe(0)
      expect(SAny.concat(0, 1)).toBe(1)
      expect(SAny.concat(1, 0)).toBe(1)
      expect(SAny.concat(1, 1)).toBe(1)
    })

    it("provides lawful output given lawful input", () => {
      laws.semigroup(
        f(isoF)(Bool.SemigroupAll),
        Eq.contramap(isoF.from)(Bool.Eq),
        fc.boolean().map(isoF.to),
      )
    })
  })
})
