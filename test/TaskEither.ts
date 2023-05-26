import {
  unsafeUnwrap,
  unsafeUnwrapLeft,
  unsafeExpect,
  unsafeExpectLeft,
  sequenceSeqArray_,
  traverseArray_,
  traverseSeqArray_,
} from "../src/TaskEither"
import * as TE from "fp-ts/TaskEither"
import * as T from "../src/Task"
import { constVoid, identity, pipe } from "fp-ts/function"
import { Show as StrShow } from "fp-ts/string"
import { mkMilliseconds } from "../src/Date"

describe("TaskEither", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("resolves Right", () => {
      return expect(f(TE.right(123))).resolves.toBe(123)
    })

    it("rejects Left", () => {
      return expect(f(TE.left("l"))).rejects.toBe("l")
    })
  })

  describe("unsafeUnwrapLeft", () => {
    const f = unsafeUnwrapLeft

    it("resolves Left", () => {
      return expect(f(TE.left(123))).resolves.toBe(123)
    })

    it("rejects Right", () => {
      return expect(f(TE.right("r"))).rejects.toBe("r")
    })
  })

  describe("unsafeExpect", () => {
    const f = unsafeExpect(StrShow)

    it("resolves Right", () => {
      return expect(f(TE.right(123))).resolves.toBe(123)
    })

    it("rejects Left via Show", () => {
      return expect(f(TE.left("l"))).rejects.toBe('"l"')
    })
  })

  describe("unsafeExpectLeft", () => {
    const f = unsafeExpectLeft(StrShow)

    it("resolves Left", () => {
      return expect(f(TE.left(123))).resolves.toBe(123)
    })

    it("rejects Right via Show", () => {
      return expect(f(TE.right("r"))).rejects.toBe('"r"')
    })
  })

  describe("sequenceSeqArray_", () => {
    const f = sequenceSeqArray_

    /* eslint-disable */
    it("sequences sequentially", async () => {
      let n = 0
      const g = pipe(
        TE.fromTask(T.sleep(mkMilliseconds(1))),
        TE.chainFirstIOK(() => () => (n = n * 2)),
      )
      const h = pipe(
        TE.fromIO(() => (n += 5)),
        TE.map(constVoid),
      )

      await pipe(f([g, h]), T.execute)

      expect(n).toBe(5)
    })
    /* eslint-enable */
  })

  describe("traverseArray_", () => {
    const f = traverseArray_

    /* eslint-disable */
    it("sequences in parallel", async () => {
      let n = 0
      const g = pipe(
        TE.fromTask(T.sleep(mkMilliseconds(1))),
        TE.chainFirstIOK(() => () => (n = n * 2)),
      )
      const h = pipe(
        TE.fromIO(() => (n += 5)),
        TE.map(constVoid),
      )

      await pipe(f(identity<TE.TaskEither<unknown, void>>)([g, h]), T.execute)

      expect(n).toBe(10)
    })
    /* eslint-enable */
  })

  describe("traverseSeqArray_", () => {
    const f = traverseSeqArray_

    /* eslint-disable */
    it("sequences in parallel", async () => {
      let n = 0
      const g = pipe(
        TE.fromTask(T.sleep(mkMilliseconds(1))),
        TE.chainFirstIOK(() => () => (n = n * 2)),
      )
      const h = pipe(
        TE.fromIO(() => (n += 5)),
        TE.map(constVoid),
      )

      await pipe(f(identity<TE.TaskEither<unknown, void>>)([g, h]), T.execute)

      expect(n).toBe(5)
    })
    /* eslint-enable */
  })
})
