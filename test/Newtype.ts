import { over } from "../src/Newtype"
import { Endomorphism } from "fp-ts/Endomorphism"
import { multiply } from "../src/Number"
import { Newtype, iso } from "newtype-ts"
import fc from "fast-check"

describe("Newtype", () => {
  type Num = Newtype<{ readonly Num: unique symbol }, number>
  const mkNum: (n: number) => Num = iso<Num>().wrap

  describe("over", () => {
    const f = over

    it("is equivalent to a lifted endomorphism", () => {
      const g: Endomorphism<number> = multiply(2)

      fc.assert(fc.property(fc.integer(), n => f(g)(mkNum(n)) === mkNum(g(n))))
    })
  })
})
