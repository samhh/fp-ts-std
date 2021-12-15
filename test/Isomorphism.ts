import { Isomorphism, toIso, fromIso, reverse } from "../src/Isomorphism"
import { Iso } from "monocle-ts/Iso"

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
})
