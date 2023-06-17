import {
  unsafeUnwrap,
  unsafeUnwrapLeft,
  runReaderTaskEither,
  asksEither,
  asksTask,
  asksTaskEither,
} from "../src/ReaderTaskEither"
import * as RTE from "fp-ts/ReaderTaskEither"
import * as T from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/function"
import fc from "fast-check"
import * as Str from "../src/String"

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

describe("ReaderTaskEither", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("resolves Right", () => {
      return expect(f(RTE.right(123))({})).resolves.toBe(123)
    })

    it("rejects Left", async () => {
      const [m, c] = await msgAndCause(f(RTE.left("l"))({}))

      expect(m).toBe("Unwrapped `Left`")
      expect(c).toBe("l")
    })
  })

  describe("unsafeUnwrapLeft", () => {
    const f = unsafeUnwrapLeft

    it("resolves Left", () => {
      return expect(f(RTE.left(123))({})).resolves.toBe(123)
    })

    it("rejects Right", async () => {
      const [m, c] = await msgAndCause(f(RTE.right("r"))({}))

      expect(m).toBe("Unwrapped `Right`")
      expect(c).toBe("r")
    })
  })

  describe("runReaderTaskEither", () => {
    it("extracts expected TaskEither right from a ReaderTaskEither", async () => {
      type Env = { dependency: string }
      const env: Env = { dependency: "dependency " }
      await fc.assert(
        fc.asyncProperty(fc.integer(), async _ => {
          const rte: RTE.ReaderTaskEither<Env, never, number> = pipe(
            E.right(_),
            RTE.fromEither,
          )
          const extractedRight = pipe(rte, runReaderTaskEither(env))()
          await expect(extractedRight).resolves.toStrictEqual(E.right(_))
        }),
      )
    })

    it("extracts expected TaskEither left from a ReaderTaskEither", async () => {
      type Env = { dependency: string }
      const env: Env = { dependency: "dependency" }
      await fc.assert(
        fc.asyncProperty(fc.integer(), async _ => {
          const rte: RTE.ReaderTaskEither<Env, number, never> = pipe(
            E.left(_),
            RTE.fromEither,
          )
          const extractedLeft = pipe(rte, runReaderTaskEither(env))()
          await expect(extractedLeft).resolves.toStrictEqual(E.left(_))
        }),
      )
    })
  })

  describe("asksEither", () => {
    it("runs action and lifts to a Reader", () => {
      return expect(
        asksEither(flow(Str.prepend("foo"), E.of))("bar")(),
      ).resolves.toEqual(E.right("foobar"))
    })
  })

  describe("asksTask", () => {
    it("runs action and lifts to a Reader", () => {
      return expect(
        asksTask(flow(Str.prepend("foo"), T.of))("bar")(),
      ).resolves.toEqual(E.right("foobar"))
    })
  })

  describe("asksTaskEither", () => {
    it("runs action and lifts to a Reader", () => {
      return expect(
        asksTaskEither(flow(Str.prepend("foo"), TE.of))("bar")(),
      ).resolves.toEqual(E.right("foobar"))
    })
  })
})
