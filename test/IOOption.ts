import { unsafeUnwrap, unsafeExpect, pass } from "../src/IOOption.js"
import * as IOO from "fp-ts/IOOption"
import { Lazy } from "../src/Lazy.js"

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

describe("IOOption", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Some", () => {
      expect(f(IOO.some(123))).toBe(123)
    })

    it("throws None", () => {
      const [m, c] = msgAndCause(() => f(IOO.none))

      expect(m).toBe("Unwrapped `None`")
      expect(c).toBe(undefined)
    })
  })

  describe("unsafeExpect", () => {
    const f = unsafeExpect("foo")

    it("unwraps Some", () => {
      expect(f(IOO.some(123))).toBe(123)
    })

    it("throws None with provided message", () => {
      const [m, c] = msgAndCause(() => f(IOO.none))

      expect(m).toBe("Unwrapped `None`")
      expect(c).toBe("foo")
    })
  })

  describe("pass", () => {
    const f = pass

    it("is equivalent to of(undefined)", () => {
      expect(unsafeUnwrap(f)).toBe(unsafeUnwrap(IOO.of(undefined)))
    })
  })
})
