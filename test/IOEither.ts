import {
  unsafeUnwrap,
  unsafeUnwrapLeft,
  unsafeExpect,
  unsafeExpectLeft,
  sequenceArray_,
  traverseArray_,
  pass,
} from "../src/IOEither"
import * as IOE from "fp-ts/IOEither"
import * as IO from "../src/IO"
import { identity, pipe } from "fp-ts/function"
import { Show as StrShow } from "fp-ts/string"

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

  describe("unsafeExpect", () => {
    const f = unsafeExpect(StrShow)

    it("unwraps Right", () => {
      expect(f(IOE.right(123))).toBe(123)
    })

    it("throws Left via Show", () => {
      expect(() => f(IOE.left("l"))).toThrow('"l"')
    })
  })

  describe("unsafeExpectLeft", () => {
    const f = unsafeExpectLeft(StrShow)

    it("unwraps Left", () => {
      expect(f(IOE.left(123))).toBe(123)
    })

    it("throws Right via Show", () => {
      expect(() => f(IOE.right("r"))).toThrow('"r"')
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

  describe("pass", () => {
    const f = pass

    it("is equivalent to of(undefined)", () => {
      expect(unsafeUnwrap(f)).toBe(unsafeUnwrap(IOE.of(undefined)))
    })
  })
})
