import { runReaderEither, asksEither } from "../src/ReaderEither"
import * as RE from "fp-ts/ReaderEither"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/function"
import fc from "fast-check"
import * as Str from "../src/String"

describe("ReaderEither", () => {
  describe("runReaderEither", () => {
    it("extracts expected Either right from a ReaderEither", () => {
      type Env = { dependency: string }
      const env: Env = { dependency: "dependency " }
      fc.assert(
        fc.property(fc.integer(), _ => {
          const re: RE.ReaderEither<Env, never, number> = pipe(
            E.right(_),
            RE.fromEither,
          )
          const extractedRight = pipe(re, runReaderEither(env))
          expect(extractedRight).toStrictEqual(E.right(_))
        }),
      )
    })

    it("extracts expected Either left from a ReaderEither", () => {
      type Env = { dependency: string }
      const env: Env = { dependency: "dependency" }
      fc.assert(
        fc.property(fc.integer(), _ => {
          const re: RE.ReaderEither<Env, number, never> = pipe(
            E.left(_),
            RE.fromEither,
          )
          const extractedLeft = pipe(re, runReaderEither(env))
          expect(extractedLeft).toStrictEqual(E.left(_))
        }),
      )
    })
  })

  describe("asksEither", () => {
    it("runs action and lifts to a Reader", () => {
      expect(asksEither(flow(Str.prepend("foo"), E.of))("bar")).toEqual(
        E.right("foobar"),
      )
    })
  })
})
