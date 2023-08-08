import { describe, it, expect } from "@jest/globals"
import { runReaderTask, asksTask } from "../src/ReaderTask"
import * as RT from "fp-ts/ReaderTask"
import * as T from "fp-ts/Task"
import { flow, pipe } from "fp-ts/function"
import fc from "fast-check"
import * as Str from "../src/String"

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

  describe("asksTask", () => {
    it("runs action and lifts to a Reader", () => {
      return expect(
        asksTask(flow(Str.prepend("foo"), T.of))("bar")(),
      ).resolves.toBe("foobar")
    })
  })
})
