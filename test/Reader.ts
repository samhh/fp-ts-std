import { runReader } from "../src/Reader.js"
import * as R from "fp-ts/Reader"
import { pipe } from "fp-ts/function"

describe("Reader", () => {
  describe("runReader", () => {
    type Env = { dependency: string }
    it("extracts expected value from a Reader", () => {
      const env: Env = { dependency: "dependency" }
      const extractedValue = pipe(R.of<Env, number>(1), runReader(env))
      return expect(extractedValue).toBe(1)
    })
  })
})
