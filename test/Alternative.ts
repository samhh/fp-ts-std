import fc from "fast-check"
import { pureIf } from "../src/Alternative"
import * as O from "fp-ts/Option"
import { constant } from "fp-ts/function"
import { Lazy } from "../src/Lazy"

describe("Alternative", () => {
  describe("pureIf", () => {
    const f = pureIf(O.Alternative)

    it("returns constant empty/zero on false", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(f(false)(constant(x))).toEqual(O.none),
        ),
      )
    })

    it("returns lifted input on true", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(f(true)(constant(x))).toEqual(O.some(x)),
        ),
      )
    })

    /* eslint-disable functional/no-expression-statement */
    it("lazily evaluates value", () => {
      let exe = false // eslint-disable-line functional/no-let
      const g: Lazy<void> = () => {
        exe = true
      }

      f(false)(g)
      expect(exe).toBe(false)

      f(true)(g)
      expect(exe).toBe(true)
    })
    /* eslint-enable functional/no-expression-statement */
  })
})
