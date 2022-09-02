/* eslint-disable functional/no-expression-statement */

import * as IO from "fp-ts/IO"
import { constVoid } from "fp-ts/function"
import { ifM } from "../src/Monad"

type IO<A> = IO.IO<A>

describe("Monad", () => {
  describe("ifM", () => {
    const f = ifM(IO.Monad)

    it("returns action according to condition", () => {
      let x = "baz" // eslint-disable-line functional/no-let
      const g =
        (y: string): IO<void> =>
        () => {
          x = y
        }

      f(IO.of(true))(g("foo"))(g("bar"))()
      expect(x).toBe("foo")

      f(IO.of(false))(g("foo"))(g("bar"))()
      expect(x).toBe("bar")
    })

    it("does not execute the non-returned condition", () => {
      let exe = false // eslint-disable-line functional/no-let
      const set: IO<void> = () => {
        exe = true
      }

      f(IO.of(true))(constVoid)(set)()
      expect(exe).toBe(false)

      f(IO.of(false))(set)(constVoid)()
      expect(exe).toBe(false)
    })
  })
})
