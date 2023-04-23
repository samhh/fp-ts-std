import {
  lines,
  unlines,
  surround,
  unsurround,
  takeLeft,
  takeRight,
  reverse,
  match,
  matchAll,
  prepend,
  unprepend,
  append,
  unappend,
  fromNumber,
  test,
  dropLeftWhile,
  dropLeft,
  dropRight,
  head,
  tail,
  last,
  init,
  lookup,
  dropRightWhile,
  under,
  replaceAll,
  takeLeftWhile,
  takeRightWhile,
  splitAt,
  isAlpha,
  isAlphaNum,
  isLower,
  isUpper,
  isSpace,
  words,
  unwords,
} from "../src/String"
import * as O from "fp-ts/Option"
import * as NEA from "fp-ts/NonEmptyArray"
import * as RA from "fp-ts/ReadonlyArray"
import { constFalse, constTrue, flow, pipe } from "fp-ts/function"
import fc from "fast-check"
import { max } from "fp-ts/Ord"
import * as N from "fp-ts/number"
import * as S from "fp-ts/string"

describe("String", () => {
  describe("lines", () => {
    const f = lines

    it("splits on \\n newlines", () => {
      expect(f("")).toEqual([""])
      expect(f("\n")).toEqual(["", ""])
      expect(f("\n\n")).toEqual(["", "", ""])
      expect(f("\na")).toEqual(["", "a"])
      expect(f("a\n")).toEqual(["a", ""])
      expect(f("a\nb")).toEqual(["a", "b"])
    })

    it("splits on \\r newlines", () => {
      expect(f("")).toEqual([""])
      expect(f("\r")).toEqual(["", ""])
      expect(f("\r\r")).toEqual(["", "", ""])
      expect(f("\ra")).toEqual(["", "a"])
      expect(f("a\r")).toEqual(["a", ""])
      expect(f("a\rb")).toEqual(["a", "b"])
    })

    it("splits on \\r\\n newlines", () => {
      expect(f("")).toEqual([""])
      expect(f("\r\n")).toEqual(["", ""])
      expect(f("\r\n\r\n")).toEqual(["", "", ""])
      expect(f("\r\na")).toEqual(["", "a"])
      expect(f("a\r\n")).toEqual(["a", ""])
      expect(f("a\r\nb")).toEqual(["a", "b"])
    })
  })

  describe("unlines", () => {
    const f = unlines

    it("morphs empty array to empty string", () => {
      expect(f([])).toBe("")
    })

    it("extracts single string out of array", () => {
      expect(f(["a"])).toBe("a")
    })

    it("joins array of strings with newlines", () => {
      expect(f(["a", "b", "c"])).toBe("a\nb\nc")
    })
  })

  describe("surround", () => {
    const f = surround

    it("surrounds empty with empty", () => {
      expect(f("")("")).toBe("")
    })

    it("surrounds empty with non-empty", () => {
      expect(f("x")("")).toBe("xx")
    })

    it("surrounds non-empty with empty", () => {
      expect(f("")("x")).toBe("x")
    })

    it("surrounds non-empty with non-empty", () => {
      expect(f("x")("y")).toBe("xyx")
    })
  })

  describe("unsurround", () => {
    const f = unsurround

    it("unsurrounds empty from empty", () => {
      expect(f("")("")).toBe("")
    })

    it("unsurrounds empty from non-empty", () => {
      expect(f("x")("")).toBe("")
    })

    it("unsurrounds non-empty from empty", () => {
      expect(f("")("x")).toBe("x")
    })

    it("unsurrounds non-empty from non-empty", () => {
      expect(f("x")("y")).toBe("y")
      expect(f("x")("xy")).toBe("xy")
      expect(f("x")("yx")).toBe("yx")
      expect(f("x")("xyx")).toBe("y")
    })
  })

  describe("takeLeft", () => {
    const f = takeLeft

    it("takes the specified number of characters from the start", () => {
      expect(f(2)("abc")).toBe("ab")
    })

    it("returns empty string for non-positive number", () => {
      fc.assert(
        fc.property(
          fc.integer({ max: 0 }),
          fc.string(),
          (n, x) => f(n)(x) === "",
        ),
      )
    })

    it("returns whole string for number that's too large", () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
          (x, n) => f(x.length + n)(x) === x,
        ),
      )
    })

    it("rounds float input down to nearest int", () => {
      const x = "abc"

      expect(f(0.1)(x)).toBe("")
      expect(f(0.9)(x)).toBe("")
      expect(f(1.1)(x)).toBe("a")
    })
  })

  describe("takeRight", () => {
    const f = takeRight

    it("takes the specified number of characters from the end", () => {
      expect(f(2)("abc")).toBe("bc")
    })

    it("returns empty string for non-positive number", () => {
      fc.assert(
        fc.property(
          fc.integer({ max: 0 }),
          fc.string(),
          (n, x) => f(n)(x) === "",
        ),
      )
    })

    it("returns whole string for number that's too large", () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
          (x, n) => f(x.length + n)(x) === x,
        ),
      )
    })

    it("rounds float input down to nearest int", () => {
      const x = "abc"

      expect(f(0.1)(x)).toBe("")
      expect(f(0.9)(x)).toBe("")
      expect(f(1.1)(x)).toBe("c")
    })
  })

  describe("reverse", () => {
    const f = reverse

    it("reverses input string", () => {
      expect(f("")).toBe("")
      expect(f("ab c")).toBe("c ba")
    })
  })

  describe("match", () => {
    // Jest won't deep match a plain array against RegExpMatchArray as it
    // includes extra non-enumerable properties
    const f = flow(
      match(/^(\d)(\w)$/),
      O.map(xs => Array.from(xs)),
    )

    it("works", () => {
      expect(f("2e")).toEqual(O.some(["2e", "2", "e"]))
      expect(f("foo")).toEqual(O.none)
    })
  })

  describe("matchAll", () => {
    const f = matchAll

    it("works with global regex", () => {
      // Jest won't deep match a plain array against RegExpMatchArray as
      // it includes extra non-enumerable properties
      const g = flow(f(/t(e)(st(\d?))/g), O.map(NEA.map(xs => Array.from(xs))))

      expect(g("test1test2")).toEqual(
        O.some([
          ["test1", "e", "st1", "1"],
          ["test2", "e", "st2", "2"],
        ]),
      )
      expect(g("foo")).toEqual(O.none)
    })

    it("does not throw with non-global regex", () => {
      fc.assert(
        fc.property(fc.string(), x => {
          // eslint-disable-next-line functional/no-expression-statements
          f(/x/)(x)
        }),
      )
    })
  })

  describe("prepend", () => {
    const f = prepend

    it("prepends", () => {
      expect(f("")("")).toBe("")
      expect(f("x")("")).toBe("x")
      expect(f("")("x")).toBe("x")
      expect(f("x")("yz")).toBe("xyz")

      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          (x, y) =>
            f(x)(y).length === x.length + y.length &&
            f(y)(x).length === x.length + y.length,
        ),
      )
    })
  })

  describe("unprepend", () => {
    const f = unprepend

    it("does not unprepend what isn't there", () => {
      expect(f("")("")).toBe("")
      expect(f("x")("")).toBe("")
      expect(f("")("x")).toBe("x")
    })

    it("unprepends if present", () => {
      expect(f("x")("xy")).toBe("y")
      expect(f("x")("xx")).toBe("x")

      fc.assert(
        fc.property(fc.string(), fc.string(), (x, y) => f(x)(x + y) === y),
      )
    })
  })

  describe("append", () => {
    const f = append

    it("appends", () => {
      expect(f("")("")).toBe("")
      expect(f("x")("")).toBe("x")
      expect(f("")("x")).toBe("x")
      expect(f("z")("xy")).toBe("xyz")

      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          (x, y) =>
            f(x)(y).length === x.length + y.length &&
            f(y)(x).length === x.length + y.length,
        ),
      )
    })
  })

  describe("unappend", () => {
    const f = unappend

    it("does not unappend what isn't there", () => {
      expect(f("")("")).toBe("")
      expect(f("x")("")).toBe("")
      expect(f("")("x")).toBe("x")
    })

    it("unappends if present", () => {
      expect(f("y")("xy")).toBe("x")
      expect(f("x")("xx")).toBe("x")

      fc.assert(
        fc.property(fc.string(), fc.string(), (x, y) => f(x)(y + x) === y),
      )
    })
  })

  describe("fromNumber", () => {
    const f = fromNumber

    it("does not modify the number at all", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.integer(), fc.float({ noNaN: true })),
          n => n === Number(f(n)),
        ),
      )
    })

    it("always returns a string", () => {
      fc.assert(
        fc.property(fc.oneof(fc.integer(), fc.float()), flow(f, S.isString)),
      )
    })
  })

  describe("test", () => {
    it("works", () => {
      const f = test(/x.z/)

      expect(f("xyz")).toBe(true)
      expect(f("axyzb")).toBe(true)
      expect(f("ayz")).toBe(false)
      expect(f("xya")).toBe(false)
    })

    it("is not stateful", () => {
      const f = test(/foo/g)
      const x = "foobar"

      expect(f(x)).toBe(true)
      expect(f(x)).toBe(true)
    })
  })

  describe("dropLeft", () => {
    const f = dropLeft

    it("returns identity for non-positive number", () => {
      expect(f(-1)("abc")).toBe("abc")

      fc.assert(
        fc.property(
          fc.string(),
          fc.integer({ max: 0 }),
          (x, n) => f(n)(x) === x,
        ),
      )
    })

    it("rounds float down to nearest integer", () => {
      expect(f(0.99)("abc")).toBe("abc")
      expect(f(1.01)("abc")).toBe("bc")
    })

    it("drops specified number of characters", () => {
      expect(f(2)("abc")).toBe("c")

      fc.assert(
        fc.property(
          fc.string(),
          fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
          (x, n) => f(n)(x).length === max(N.Ord)(0, x.length - n),
        ),
      )
    })
  })

  describe("dropLeftWhile", () => {
    const f = dropLeftWhile

    it("returns identity on constFalse", () => {
      fc.assert(fc.property(fc.string(), x => f(constFalse)(x) === x))
    })

    it("returns empty on constTrue", () => {
      fc.assert(fc.property(fc.string(), x => f(constTrue)(x) === ""))
    })

    it("drops until a match", () => {
      expect(f(x => x !== "d")("abcdef")).toBe("def")
    })
  })

  describe("dropRight", () => {
    const f = dropRight

    it("returns identity for non-positive number", () => {
      expect(f(-1)("abc")).toBe("abc")

      fc.assert(
        fc.property(
          fc.string(),
          fc.integer({ max: 0 }),
          (x, n) => f(n)(x) === x,
        ),
      )
    })

    it("rounds float down to nearest integer", () => {
      expect(f(0.99)("abc")).toBe("abc")
      expect(f(1.01)("abc")).toBe("ab")
    })

    it("drops specified number of characters", () => {
      expect(f(2)("abc")).toBe("a")

      fc.assert(
        fc.property(
          fc.string(),
          fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
          (x, n) => f(n)(x).length === max(N.Ord)(0, x.length - n),
        ),
      )
    })
  })

  describe("head", () => {
    const f = head

    it("returns None for empty string", () => {
      expect(f("")).toEqual(O.none)
    })

    it("returns first character of non-empty string", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), x =>
          expect(f(x)).toEqual(O.some(x[0])),
        ),
      )
    })
  })

  describe("tail", () => {
    const f = tail

    it("returns None for empty string", () => {
      expect(f("")).toEqual(O.none)
    })

    it("returns empty string for string with one character", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 1 }), x =>
          expect(f(x)).toEqual(O.some("")),
        ),
      )
    })

    it("returns string with all but first character for length >= 2", () => {
      expect(f("xy")).toEqual(O.some("y"))
      expect(f("xyz")).toEqual(O.some("yz"))
    })

    it("returns string one character smaller", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), x =>
          pipe(
            f(x),
            O.exists(y => y.length === x.length - 1),
          ),
        ),
      )
    })
  })

  describe("last", () => {
    const f = last

    it("returns None for empty string", () => {
      expect(f("")).toEqual(O.none)
    })

    it("returns last character of non-empty string", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), x =>
          expect(f(x)).toEqual(O.some(x[x.length - 1])),
        ),
      )
    })
  })

  describe("init", () => {
    const f = init

    it("returns None for empty string", () => {
      expect(f("")).toEqual(O.none)
    })

    it("returns empty string for string with one character", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 1 }), x =>
          expect(f(x)).toEqual(O.some("")),
        ),
      )
    })

    it("returns string with all but last character for length >= 2", () => {
      expect(f("xy")).toEqual(O.some("x"))
      expect(f("xyz")).toEqual(O.some("xy"))
    })

    it("returns string one character smaller", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), x =>
          pipe(
            f(x),
            O.exists(y => y.length === x.length - 1),
          ),
        ),
      )
    })
  })

  describe("lookup", () => {
    const f = lookup

    it("returns None if index out of bounds", () => {
      expect(f(1)("a")).toEqual(O.none)

      fc.assert(
        fc.property(fc.string(), x => expect(f(x.length)(x)).toEqual(O.none)),
      )
    })

    it("returns character if in bounds", () => {
      expect(f(1)("abc")).toEqual(O.some("b"))

      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), x =>
          expect(f(0)(x)).toEqual(O.some(x[0])),
        ),
      )
    })
  })

  describe("dropRightWhile", () => {
    const f = dropRightWhile

    it("removes chars from the right until predicate fails", () => {
      expect(f(x => x === "a")("aabaa")).toEqual("aab")
    })

    it("constTrue returns empty string", () => {
      fc.assert(
        fc.property(fc.string(), x => expect(f(constTrue)(x)).toEqual("")),
      )
    })

    it("constFalse returns original string", () => {
      fc.assert(
        fc.property(fc.string(), x => expect(f(constFalse)(x)).toEqual(x)),
      )
    })
  })

  describe("under", () => {
    const f = under

    it("applies function to string", () => {
      expect(f(RA.map(S.toUpperCase))("Hello!")).toBe("HELLO!")
      expect(f(RA.filter(x => x !== "x"))("axbxc")).toBe("abc")
    })
  })

  describe("replaceAll", () => {
    const f = replaceAll

    it("replaces all matches", () => {
      expect(f("x")("y")("xyzxyz")).toBe("yyzyyz")
    })
  })

  describe("takeLeftWhile", () => {
    const f = takeLeftWhile

    it("takes all chars until a predicate fails", () => {
      expect(f(x => x !== "c")("abcd")).toEqual("ab")
    })

    it("empty string returns empty string regardless of predicate", () => {
      expect(f(constTrue)("")).toBe("")
      expect(f(constFalse)("")).toBe("")
    })

    it("returns input string on constTrue", () => {
      fc.assert(fc.property(fc.string(), x => f(constTrue)(x) === x))
    })

    it("returns empty string on constFalse", () => {
      fc.assert(fc.property(fc.string(), x => f(constFalse)(x) === ""))
    })
  })

  describe("takeRightWhile", () => {
    const f = takeRightWhile

    it("takes all chars from the end until a predicate fails", () => {
      expect(f(x => x !== "b")("abcd")).toEqual("cd")
    })

    it("empty string returns empty string regardless of predicate", () => {
      expect(f(constTrue)("")).toBe("")
      expect(f(constFalse)("")).toBe("")
    })

    it("returns input string on constTrue", () => {
      fc.assert(fc.property(fc.string(), x => f(constTrue)(x) === x))
    })

    it("returns empty string on constFalse", () => {
      fc.assert(fc.property(fc.string(), x => f(constFalse)(x) === ""))
    })
  })

  describe("splitAt", () => {
    it('"joining" results in the same string', () => {
      fc.assert(
        fc.property(
          fc.integer(),
          fc.string(),
          (index, str) => splitAt(index)(str).join("") === str,
        ),
      )
    })

    it("first and last elements are the same as splits at index", () => {
      fc.assert(
        fc.property(fc.integer(), fc.string(), (index, str) => {
          const tuple = splitAt(index)(str)
          return (
            tuple[0] === S.slice(0, index)(str) &&
            tuple[1] === S.slice(index, Infinity)(str)
          )
        }),
      )
    })
  })

  describe("isAlpha", () => {
    const f = isAlpha

    it("fails on any non-alphabetic char", () => {
      expect(f("x1")).toBe(false)
      expect(f("x y")).toBe(false)
    })

    it("accepts a diverse range of alphabetic chars", () => {
      expect(f("aöкإ")).toBe(true)
    })
  })

  describe("isAlphaNum", () => {
    const f = isAlphaNum

    it("accepts numbers", () => {
      expect(f("x1y2")).toBe(true)
    })

    it("fails on any non-alphabetic/numeric char", () => {
      expect(f("x y")).toBe(false)
    })

    it("accepts a diverse range of alphabetic chars", () => {
      expect(f("aöкإ")).toBe(true)
    })
  })

  describe("isLower", () => {
    const f = isLower

    it("fails on any uppercase char", () => {
      expect(f("aB")).toBe(false)
      expect(f("B")).toBe(false)
    })

    it("accepts a diverse range of lowercase chars", () => {
      expect(f("aöк")).toBe(true)
    })
  })

  describe("isUpper", () => {
    const f = isUpper

    it("fails on any lowercase char", () => {
      expect(f("Ab")).toBe(false)
      expect(f("b")).toBe(false)
    })

    it("accepts a diverse range of alphabetic chars", () => {
      expect(f("ÁB")).toBe(true)
    })
  })

  describe("isSpace", () => {
    const f = isSpace

    it("fails on any non-whitespace char", () => {
      expect(f("x")).toBe(false)
      expect(f("x y")).toBe(false)
      expect(f("\t!\n")).toBe(false)
    })

    it("accepts any whitespace char", () => {
      expect(f("\t    \n")).toBe(true)
    })
  })

  describe("words", () => {
    const f = words

    it("splits on whitespace", () => {
      expect(f("")).toEqual([""])
      expect(f(" ")).toEqual(["", ""])
      expect(f("  ")).toEqual(["", "", ""])
      expect(f(" a")).toEqual(["", "a"])
      expect(f("a ")).toEqual(["a", ""])
      expect(f("a b")).toEqual(["a", "b"])
    })

    it("splits on newlines", () => {
      expect(f("")).toEqual([""])
      expect(f("\n")).toEqual(["", ""])
      expect(f("\n\n")).toEqual(["", "", ""])
      expect(f("\na")).toEqual(["", "a"])
      expect(f("a\n")).toEqual(["a", ""])
      expect(f("a\nb")).toEqual(["a", "b"])
    })
  })

  describe("unwords", () => {
    const f = unwords

    it("morphs empty array to empty string", () => {
      expect(f([])).toBe("")
    })

    it("extracts single string out of array", () => {
      expect(f(["a"])).toBe("a")
    })

    it("joins array of strings with whitespace", () => {
      expect(f(["a", "b", "c"])).toBe("a b c")
    })
  })
})
