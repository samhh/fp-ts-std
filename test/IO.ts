import { IO } from "fp-ts/IO"
import { constant, constVoid } from "fp-ts/function"
import { tap } from "../src/IO"
import fc from "fast-check"

describe("IO", () => {
  describe("tap", () => {
    const f = tap

    it("performs the side effect", () => {
      let x = false // eslint-disable-line functional/no-let
      const g = (y: boolean): IO<void> => () => {
        x = y // eslint-disable-line functional/no-expression-statement
      }

      expect(x).toBe(false)
      f(g)(true)() // eslint-disable-line functional/no-expression-statement
      expect(x).toBe(true)
    })

    it("returns the value unmodified", () => {
      fc.assert(
        fc.property(fc.string(), x => f(constant(constVoid))(x)() === x),
      )
    })
  })
})
