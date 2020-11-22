import * as IO from "fp-ts/IO"
import { constant, constVoid } from "fp-ts/function"
import { tap, once } from "../src/IO"
import { add } from "../src/Number"
import fc from "fast-check"

type IO<A> = IO.IO<A>

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

  describe("once", () => {
    const f = once

    it("always returns the first input", () => {
      const g = f(add(5))

      expect(g(2)()).toBe(7)
      expect(g(3)()).toBe(7)
    })

    it("only calls function once", () => {
      let runs = 0 // eslint-disable-line functional/no-let
      const g = f<number, number>(n => {
        runs++ // eslint-disable-line functional/no-expression-statement
        return add(5)(n)
      })

      expect(runs).toBe(0)
      expect(g(2)()).toBe(7)
      expect(runs).toBe(1)
      expect(g(3)()).toBe(7)
      expect(runs).toBe(1)
      expect(g(2)()).toBe(7)
      expect(runs).toBe(1)
    })

    it("does not cross-pollute", () => {
      const g = f(add(5))
      const h = f(add(15))

      expect(g(2)()).toBe(7)
      expect(h(2)()).toBe(17)
      expect(g(3)()).toBe(7)
      expect(h(3)()).toBe(17)
    })
  })
})
