import { unsafeUnwrap, unsafeExpect, pass } from "../src/TaskOption"
import * as TO from "fp-ts/TaskOption"

const msgAndCause = async (f: Promise<unknown>): Promise<[string, unknown]> => {
  /* eslint-disable */
  try {
    await f
    throw "didn't throw"
  } catch (e) {
    if (!(e instanceof Error)) throw "threw unexpected type"
    return [e.message, e.cause]
  }
  /* eslint-enable */
}

describe("TaskOption", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Some", () => {
      return expect(f(TO.some(123))).resolves.toBe(123)
    })

    it("throws None", async () => {
      const [m, c] = await msgAndCause(f(TO.none))

      expect(m).toBe("Unwrapped `None`")
      expect(c).toBe(undefined)
    })
  })

  describe("unsafeExpect", () => {
    const f = unsafeExpect("foo")

    it("unwraps Some", () => {
      return expect(f(TO.some(123))).resolves.toBe(123)
    })

    it("throws None with provided message", async () => {
      const [m, c] = await msgAndCause(f(TO.none))

      expect(m).toBe("Unwrapped `None`")
      expect(c).toBe("foo")
    })
  })

  describe("pass", () => {
    const f = pass

    it("is equivalent to of(undefined)", async () => {
      expect(await unsafeUnwrap(f)).toBe(await unsafeUnwrap(TO.of(undefined)))
    })
  })
})
