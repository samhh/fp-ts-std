import { iterable } from "../src"
import { string as String } from "fp-ts"
import * as fc from "fast-check"
import * as laws from "fp-ts-laws"

describe("iterable", () => {
  describe("getEq", () => {
    it("should equal itself when empty", () => {
      const eq = iterable.getEq(String.Eq)
      // eslint-disable-next-line
      laws.eq(eq, fc.array(fc.string()))
    })
  })
})
