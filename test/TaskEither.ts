import {
  mapBoth,
  unsafeUnwrap,
  unsafeUnwrapLeft,
  unsafeExpect,
  unsafeExpectLeft,
  sequenceArray_,
  sequenceSeqArray_,
  traverseArray_,
  traverseSeqArray_,
} from "../src/TaskEither"
import * as TE from "fp-ts/TaskEither"
import * as T from "../src/Task"
import * as E from "fp-ts/Either"
import { constVoid, identity, pipe } from "fp-ts/function"
import * as Str from "../src/String"
import { Show as StrShow } from "fp-ts/string"
import fc from "fast-check"
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

  describe("mapBoth", () => {
    const f = mapBoth

    it("returns identity on identity input", async () => {
      await fc.assert(
        fc.asyncProperty(fc.string(), async x => {
          await expect(f(identity)(TE.left(x))()).resolves.toEqual(E.left(x))
          await expect(f(identity)(TE.right(x))()).resolves.toEqual(E.right(x))
        }),
      )
    })

    it("maps both sides", async () => {
      const g = Str.append("!")

      await fc.assert(
        fc.asyncProperty(fc.string(), async x => {
          await expect(f(g)(TE.left(x))()).resolves.toEqual(E.left(g(x)))
          await expect(f(g)(TE.right(x))()).resolves.toEqual(E.right(g(x)))
        }),
      )
    })

    it("is equivalent to doubly applied bimap", async () => {
      const g = Str.append("!")

      await fc.assert(
        fc.asyncProperty(fc.string(), async x => {
          await expect(f(g)(TE.left(x))()).resolves.toEqual(
            E.bimap(g, g)(E.left(x)),
          )
          await expect(f(g)(TE.right(x))()).resolves.toEqual(
            E.bimap(g, g)(E.right(x)),
          )
        }),
      )
    })

    describe("sequenceArray_", () => {
      const f = sequenceArray_

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

        await pipe(f([g, h]), T.execute)

        expect(n).toBe(10)
      })
      /* eslint-enable */
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
