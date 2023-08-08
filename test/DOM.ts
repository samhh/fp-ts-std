import { describe, it, expect, jest } from "@jest/globals"
import {
  fromNodeList,
  querySelector,
  querySelectorAll,
  childNodes,
  remove,
  appendChild,
  emptyChildren,
  addEventListener,
  addEventListener_,
  getTextContent,
  setTextContent,
} from "../src/DOM"
import * as IO from "fp-ts/IO"
import * as O from "fp-ts/Option"
import * as NEA from "fp-ts/NonEmptyArray"
import * as A from "fp-ts/Array"
import { JSDOM } from "jsdom"
import { constVoid, constant, pipe } from "fp-ts/function"
import { unsafeUnwrap } from "../src/Option"
import { execute as IOexecute } from "../src/IO"

describe("DOM", () => {
  describe("fromNodeList", () => {
    const f = fromNodeList

    it("converts from nodelist to array", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")
      const xs = document.querySelectorAll("li")

      expect(Array.isArray(xs)).toBe(false)
      expect(Array.isArray(f(xs))).toBe(true)
    })
  })

  describe("querySelector", () => {
    const f = querySelector

    it("returns first found element if there are any", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      const txt = pipe(
        f("li")(document)(),
        O.map(el => el.textContent),
      )
      expect(txt).toEqual(O.some("1"))
    })

    it("returns None if there are none", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      expect(f("h1")(document)()).toEqual(O.none)
    })

    it("dispatches action anew on each call", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      const lastText = pipe(
        f("li:last-child")(document),
        IO.map(O.map(el => el.textContent)),
      )

      expect(lastText()).toEqual(O.some("2"))

      // eslint-disable-next-line functional/no-expression-statements
      document.querySelector("li:last-child")?.remove()

      expect(lastText()).toEqual(O.some("1"))
    })
  })

  describe("querySelectorAll", () => {
    const f = querySelectorAll

    it("returns every found element", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      const txts = pipe(
        f("li")(document)(),
        O.map(NEA.map(el => el.textContent)),
      )

      expect(txts).toEqual(O.some(["1", "2"]))
    })

    it("returns None if there are none", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      expect(f("h1")(document)()).toEqual(O.none)
    })

    it("dispatches action anew on each call", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      const len = pipe(f("li")(document), IO.map(O.fold(constant(0), A.size)))

      expect(len()).toEqual(2)

      // eslint-disable-next-line functional/no-expression-statements
      document.querySelector("li:last-child")?.remove()

      expect(len()).toEqual(1)
    })
  })

  describe("childNodes", () => {
    const f = childNodes

    it("returns direct descendants", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      const el = unsafeUnwrap(querySelector("ul")(document)())
      const txts = pipe(f(el)(), O.map(NEA.map(el => el.textContent)))

      expect(txts).toEqual(O.some(["1", "2"]))
    })

    it("returns None if no descendants", () => {
      const {
        window: { document },
      } = new JSDOM("<div></div>")

      const el = unsafeUnwrap(querySelector("div")(document)())
      expect(f(el)()).toEqual(O.none)
    })

    it("dispatches action anew on each call", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      const el = unsafeUnwrap(querySelector("ul")(document)())
      const len = pipe(f(el), IO.map(O.fold(constant(0), A.size)))

      expect(len()).toBe(2)

      // eslint-disable-next-line functional/no-expression-statements
      document.querySelector("li:last-child")?.remove()

      expect(len()).toBe(1)
    })
  })

  describe("remove", () => {
    const f = remove

    it("removes node from tree", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      const parent = pipe(querySelector("ul")(document), IO.map(unsafeUnwrap))
      const child = unsafeUnwrap(querySelector("li")(parent())())
      const len = pipe(
        parent,
        IO.chain(childNodes),
        IO.map(O.fold(constant(0), A.size)),
      )

      expect(len()).toBe(2)

      // eslint-disable-next-line functional/no-expression-statements
      f(child)()

      expect(len()).toBe(1)
    })

    it("doesn't throw if node is already removed", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>1</li><li>2</li></ul>")

      const parent = pipe(querySelector("ul")(document), IO.map(unsafeUnwrap))
      const child = unsafeUnwrap(querySelector("li")(parent())())
      const len = pipe(
        parent,
        IO.chain(childNodes),
        IO.map(O.fold(constant(0), A.size)),
      )

      expect(len()).toBe(2)

      // eslint-disable-next-line functional/no-expression-statements
      f(child)()

      expect(len()).toBe(1)

      // eslint-disable-next-line functional/no-expression-statements
      f(child)()

      expect(len()).toBe(1)
    })
  })

  describe("appendChild", () => {
    const f = appendChild

    it("appends element to children", () => {
      const pre = "<ul><li>1</li><li>2</li>"
      const post = "</ul>"

      const {
        window: { document },
      } = new JSDOM(pre + post)

      const parent = pipe(querySelector("ul")(document), IO.map(unsafeUnwrap))
      const child = unsafeUnwrap(querySelector("li")(parent())()).cloneNode()
      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
      child.textContent = "3"

      expect(parent().outerHTML).toBe(pre + post)

      // eslint-disable-next-line functional/no-expression-statements
      f(child)(parent())()

      expect(parent().outerHTML).toBe(pre + "<li>3</li>" + post)
    })
  })

  describe("emptyChildren", () => {
    const f = emptyChildren

    it("removes all children", () => {
      const inner = "<li>1</li><li>2</li>"
      const {
        window: { document },
      } = new JSDOM("<ul>" + inner + "</ul>")

      const parent = pipe(querySelector("ul")(document), IO.map(unsafeUnwrap))

      expect(parent().innerHTML).toBe(inner)

      // eslint-disable-next-line functional/no-expression-statements
      f(parent())()

      expect(parent().innerHTML).toBe("")
    })
  })

  describe("addEventListener", () => {
    const f = addEventListener

    it("calls callback on event trigger", () => {
      const {
        window: { document },
      } = new JSDOM("<div></div>")

      const parent = pipe(
        querySelector("div")(document),
        IO.map(unsafeUnwrap),
        IO.map(el => el as HTMLElement),
      )

      // eslint-disable-next-line functional/no-let
      let clicks = 0
      expect(clicks).toBe(0)

      // eslint-disable-next-line functional/no-expression-statements
      parent().click()
      expect(clicks).toBe(0)

      // eslint-disable-next-line functional/no-expression-statements
      f("click")(() => () => {
        // eslint-disable-next-line functional/no-expression-statements
        clicks++
      })(parent())()

      // eslint-disable-next-line functional/no-expression-statements
      parent().click()
      expect(clicks).toBe(1)

      // eslint-disable-next-line functional/no-expression-statements
      parent().click()
      expect(clicks).toBe(2)
    })

    it("returns an IO for removing the mounted event listener", () => {
      const someFunction: IO.IO<void> = IO.of(constVoid)
      const someEventFunction: (e: Event) => IO.IO<void> = () => someFunction

      const mockSomeEventFunction = jest.fn(someEventFunction)

      const {
        window: { document },
      } = new JSDOM("<div></div>")

      const findElement = pipe(
        querySelector("div")(document),
        IO.map(unsafeUnwrap),
        IO.map(el => el as HTMLElement),
      )

      // eslint-disable-next-line functional/no-expression-statements
      const eventListenerCleanup = pipe(
        findElement,
        IO.chain(addEventListener("click")(mockSomeEventFunction)),
        IOexecute,
      )
      expect(mockSomeEventFunction).toBeCalledTimes(0)

      // eslint-disable-next-line functional/no-expression-statements
      findElement().click()
      expect(mockSomeEventFunction).toBeCalledTimes(1)

      // eslint-disable-next-line functional/no-expression-statements
      findElement().click()
      expect(mockSomeEventFunction).toBeCalledTimes(2)

      // eslint-disable-next-line functional/no-expression-statements
      IOexecute(eventListenerCleanup)

      // eslint-disable-next-line functional/no-expression-statements
      findElement().click()
      expect(mockSomeEventFunction).toBeCalledTimes(2)
    })
  })

  describe("addEventListener_", () => {
    const f = addEventListener_

    it("calls callback on event trigger", () => {
      const {
        window: { document },
      } = new JSDOM("<div></div>")

      const parent = pipe(
        querySelector("div")(document),
        IO.map(unsafeUnwrap),
        IO.map(el => el as HTMLElement),
      )

      // eslint-disable-next-line functional/no-let
      let clicks = 0
      expect(clicks).toBe(0)

      // eslint-disable-next-line functional/no-expression-statements
      parent().click()
      expect(clicks).toBe(0)

      // eslint-disable-next-line functional/no-expression-statements
      f("click")(() => () => {
        // eslint-disable-next-line functional/no-expression-statements
        clicks++
      })(parent())()

      // eslint-disable-next-line functional/no-expression-statements
      parent().click()
      expect(clicks).toBe(1)

      // eslint-disable-next-line functional/no-expression-statements
      parent().click()
      expect(clicks).toBe(2)
    })
  })

  describe("getTextContent", () => {
    const f = getTextContent

    it("gets text content", () => {
      const {
        window: { document },
      } = new JSDOM("<ul><li>123</li><li>abc</li></ul>")
      const els = document.querySelectorAll("li")
      const txts = fromNodeList(els).map(x => f(x)())

      expect(txts).toEqual([O.some("123"), O.some("abc")])
    })
  })

  describe("setTextContent", () => {
    const f = setTextContent

    it("sets text content", () => {
      const {
        window: { document },
      } = new JSDOM("<div></div>")

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const el = document.querySelector("div")!
      expect(el.textContent).toBe("")

      // eslint-disable-next-line functional/no-expression-statements
      f("x")(el)()
      expect(el.textContent).toBe("x")

      // eslint-disable-next-line functional/no-expression-statements
      f("yz")(el)()
      expect(el.textContent).toBe("yz")
    })
  })
})
