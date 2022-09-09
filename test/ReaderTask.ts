import { runReaderTask } from "../src/ReaderTask"
import * as RT from "fp-ts/ReaderTask"
import { pipe } from "fp-ts/function"
import fc from "fast-check"

describe("ReaderTask", () => {
  describe("runReaderTask", () => {
    it("extracts expected Task from a ReaderTask", async () => {
      type Env = { dependency: string }
      const env: Env = { dependency: "dependency" }
      await fc.assert(
        fc.asyncProperty(fc.integer(), async _ => {
          const extractedTask = pipe(
            RT.of<Env, number>(_),
            runReaderTask(env),
          )()
          await expect(extractedTask).resolves.toBe(_)
        }),
      )
    })
  })
})
