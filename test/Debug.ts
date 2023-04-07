/* eslint-disable functional/no-expression-statement */

import { trace, traceWithValue, traceShowWithValue } from "../src/Debug"
import fc from "fast-check"
import { constVoid } from "fp-ts/function"
import * as Str from "fp-ts/string"

describe("Debug", () => {
  describe("trace", () => {
    const f = trace

    it("logs string message", () => {
      fc.assert(
        fc.property(fc.string(), x => {
          const spy = jest
            .spyOn(global.console, "log")
            .mockImplementation(constVoid)
          f(x)(undefined)
          expect(console.log).toHaveBeenCalledTimes(1)
          expect(console.log).toHaveBeenCalledWith(x)
          spy.mockRestore()
        }),
      )
    })

    it("returns provided value by reference", () => {
      fc.assert(
        fc.property(fc.anything(), x => {
          const spy = jest
            .spyOn(global.console, "log")
            .mockImplementation(constVoid)
          expect(f("")(x)).toBe(x)
          spy.mockRestore()
        }),
      )
    })
  })

  describe("traceWithValue", () => {
    const f = traceWithValue

    it("logs string message and value", () => {
      fc.assert(
        fc.property(fc.string(), fc.anything(), (x, y) => {
          const spy = jest
            .spyOn(global.console, "log")
            .mockImplementation(constVoid)
          f(x)(y)
          expect(console.log).toHaveBeenCalledTimes(1)
          expect(console.log).toHaveBeenCalledWith(x, y)
          spy.mockRestore()
        }),
      )
    })

    it("returns provided value by reference", () => {
      fc.assert(
        fc.property(fc.anything(), x => {
          const spy = jest
            .spyOn(global.console, "log")
            .mockImplementation(constVoid)
          expect(f("")(x)).toBe(x)
          spy.mockRestore()
        }),
      )
    })
  })

  describe("traceShowWithValue", () => {
    const f = traceShowWithValue(Str.Show)

    it("logs string message and shown value", () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), (x, y) => {
          const spy = jest
            .spyOn(global.console, "log")
            .mockImplementation(constVoid)
          f(x)(y)
          expect(console.log).toHaveBeenCalledTimes(1)
          expect(console.log).toHaveBeenCalledWith(x, Str.Show.show(y))
          spy.mockRestore()
        }),
      )
    })

    it("returns provided value by reference", () => {
      fc.assert(
        fc.property(fc.string(), x => {
          const spy = jest
            .spyOn(global.console, "log")
            .mockImplementation(constVoid)
          expect(f("")(x)).toBe(x)
          spy.mockRestore()
        }),
      )
    })
  })
})
