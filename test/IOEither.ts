import {
  mapBoth,
  unsafeUnwrap,
  unsafeUnwrapLeft,
  sequenceArray_,
  traverseArray_,
} from "../src/IOEither"
import * as IOE from "fp-ts/IOEither"
import * as IO from "../src/IO"
import * as E from "fp-ts/Either"
import { identity, pipe } from "fp-ts/function"
import * as Str from "../src/String"
import fc from "fast-check"

describe("IOEither", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Right", () => {
      expect(f(IOE.right(123))).toBe(123)
    })

    it("throws Left", () => {
      expect(() => f(IOE.left("l"))).toThrow("l")
    })
  })

  describe("unsafeUnwrapLeft", () => {
    const f = unsafeUnwrapLeft

    it("unwraps Left", () => {
      expect(f(IOE.left(123))).toBe(123)
    })

    it("throws Right", () => {
      expect(() => f(IOE.right("r"))).toThrow("r")
    })
  })

  describe("mapBoth", () => {
    const f = mapBoth

    it("returns identity on identity input", () => {
      fc.assert(
        fc.property(fc.string(), x => {
          expect(f(identity)(IOE.left(x))()).toEqual(E.left(x))
          expect(f(identity)(IOE.right(x))()).toEqual(E.right(x))
        }),
      )
    })

    it("maps both sides", () => {
      const g = Str.append("!")

      fc.assert(
        fc.property(fc.string(), x => {
          expect(f(g)(IOE.left(x))()).toEqual(E.left(g(x)))
          expect(f(g)(IOE.right(x))()).toEqual(E.right(g(x)))
        }),
      )
    })

    it("is equivalent to doubly applied bimap", () => {
      const g = Str.append("!")

      fc.assert(
        fc.property(fc.string(), x => {
          expect(f(g)(IOE.left(x))()).toEqual(E.bimap(g, g)(E.left(x)))
          expect(f(g)(IOE.right(x))()).toEqual(E.bimap(g, g)(E.right(x)))
        }),
      )
    })
  })

  describe("sequenceArray_", () => {
    const f = sequenceArray_

    /* eslint-disable */
    it("sequences from left to right", () => {
      let n = 0

      const g: IOE.IOEither<void, void> = IOE.fromIO(() => void (n += 5))
      const h: IOE.IOEither<void, void> = IOE.fromIO(() => void (n *= 2))

      pipe(f([g, h]), IO.execute)

      expect(n).toBe(10)
    })
    /* eslint-enable */
  })

  describe("traverseArray_", () => {
    const f = traverseArray_

    /* eslint-disable */
    it("traverses from left to right", () => {
      let n = 0

      const g: IOE.IOEither<void, void> = IOE.fromIO(() => void (n += 5))
      const h: IOE.IOEither<void, void> = IOE.fromIO(() => void (n *= 2))

      pipe(f(identity<IOE.IOEither<void, void>>)([g, h]), IO.execute)

      expect(n).toBe(10)
    })
    /* eslint-enable */
  })
})
