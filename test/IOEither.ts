import { describe, it, expect } from "@jest/globals"
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
import { Lazy } from "../src/Lazy"

const msgAndCause = (f: Lazy<unknown>): [string, unknown] => {
  /* eslint-disable */
  try {
    f()
    throw "didn't throw"
  } catch (e) {
    if (!(e instanceof Error)) throw "threw unexpected type"
    return [e.message, e.cause]
  }
  /* eslint-enable */
}

describe("IOEither", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Right", () => {
      expect(f(IOE.right(123))).toBe(123)
    })

    it("throws Left", () => {
      const [m, c] = msgAndCause(() => f(IOE.left("l")))

      expect(m).toBe("Unwrapped `Left`")
      expect(c).toBe("l")
    })
  })

  describe("unsafeUnwrapLeft", () => {
    const f = unsafeUnwrapLeft

    it("unwraps Left", () => {
      expect(f(IOE.left(123))).toBe(123)
    })

    it("throws Right", () => {
      const [m, c] = msgAndCause(() => f(IOE.right("r")))

      expect(m).toBe("Unwrapped `Right`")
      expect(c).toBe("r")
    })
  })

  describe("unsafeExpect", () => {
    const f = unsafeExpect(StrShow)

    it("unwraps Right", () => {
      expect(f(IOE.right(123))).toBe(123)
    })

    it("throws Left via Show", () => {
      const [m, c] = msgAndCause(() => f(IOE.left("l")))

      expect(m).toBe("Unwrapped `Left`")
      expect(c).toBe('"l"')
    })
  })

  describe("unsafeExpectLeft", () => {
    const f = unsafeExpectLeft(StrShow)

    it("unwraps Left", () => {
      expect(f(IOE.left(123))).toBe(123)
    })

    it("throws Right via Show", () => {
      const [m, c] = msgAndCause(() => f(IOE.right("r")))

      expect(m).toBe("Unwrapped `Right`")
      expect(c).toBe('"r"')
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
