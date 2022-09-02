/* eslint-disable functional/no-expression-statement */

import * as IO from "fp-ts/IO"
import { constVoid } from "fp-ts/function"
import { ifM, andM, orM } from "../src/Monad"

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

  describe("andM", () => {
    const f = andM(IO.Monad)

    it("equivalent to lifted &&", () => {
      expect(f(IO.of(true))(IO.of(true))()).toBe(true && true)
      expect(f(IO.of(true))(IO.of(false))()).toBe(true && false)
      expect(f(IO.of(false))(IO.of(true))()).toBe(false && true)
      expect(f(IO.of(false))(IO.of(false))()).toBe(false && false)
    })

    it("short-circuits", () => {
      let exe = false // eslint-disable-line functional/no-let
      const set: IO<boolean> = () => {
        exe = true
        return true
      }

      f(IO.of(false))(set)()
      expect(exe).toBe(false)

      f(IO.of(true))(set)()
      expect(exe).toBe(true)
    })
  })

  describe("orM", () => {
    const f = orM(IO.Monad)

    it("equivalent to lifted ||", () => {
      expect(f(IO.of(true))(IO.of(true))()).toBe(true || true)
      expect(f(IO.of(true))(IO.of(false))()).toBe(true || false)
      expect(f(IO.of(false))(IO.of(true))()).toBe(false || true)
      expect(f(IO.of(false))(IO.of(false))()).toBe(false || false)
    })

    it("short-circuits", () => {
      let exe = false // eslint-disable-line functional/no-let
      const set: IO<boolean> = () => {
        exe = true
        return true
      }

      f(IO.of(true))(set)()
      expect(exe).toBe(false)

      f(IO.of(false))(set)()
      expect(exe).toBe(true)
    })
  })
})
