/**
 * This module provides some essential DOM bindings. Technically this module
 * doesn't make any assumptions about your environment, so just as it will work
 * in the browser over say `document`, it will also work for anything else
 * that's standards-compliant, such as {@link https://github.com/jsdom/jsdom jsdom}.
 *
 * @since 0.12.0
 */

import * as IO from "fp-ts/IO"
type IO<A> = IO.IO<A>
import { IOOption } from "fp-ts/IOOption"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"
import * as NEA from "fp-ts/NonEmptyArray"
import * as O from "fp-ts/Option"
import { constVoid, flow, pipe } from "fp-ts/function"
import { invoke } from "./Function"
/**
 * Convert a `NodeList` into an `Array`.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { fromNodeList } from 'fp-ts-std/DOM'
 *
 * const { window: { document } } = new JSDOM('irrelevant')
 * const xs = document.querySelectorAll('div')
 *
 * assert.strictEqual(Array.isArray(xs), false)
 * assert.strictEqual(Array.isArray(fromNodeList(xs)), true)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const fromNodeList: <A extends Node>(xs: NodeListOf<A>) => Array<A> =
	Array.from

/**
 * Returns the first descendent element of the input node matching the provided
 * selector.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { querySelector, getTextContent } from 'fp-ts-std/DOM'
 * import { pipe } from 'fp-ts/function'
 * import * as IOO from 'fp-ts/IOOption'
 * import * as O from 'fp-ts/Option'
 *
 * const { window: { document } } = new JSDOM('<ul><li>x</li><li>y</li></ul>')
 * const f = (x: string) =>
 *   pipe(document, querySelector(x), IOO.chain(getTextContent))
 *
 * assert.deepStrictEqual(f('li:nth-child(1)')(), O.some('x'))
 * assert.deepStrictEqual(f('li:nth-child(2)')(), O.some('y'))
 * assert.deepStrictEqual(f('li:nth-child(3)')(), O.none)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const querySelector =
	(q: string) =>
	(x: ParentNode): IOOption<Element> =>
	() =>
		pipe(x, invoke("querySelector")([q]), O.fromNullable)

/**
 * Returns every descendent element of the input node matching the provided
 * selector.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { querySelectorAll } from 'fp-ts-std/DOM'
 * import { pipe } from 'fp-ts/function'
 * import * as IOO from 'fp-ts/IOOption'
 * import * as O from 'fp-ts/Option'
 * import * as A from 'fp-ts/Array'
 *
 * const { window: { document } } = new JSDOM('<ul><li>x</li><li>y</li></ul>')
 * const getNumListItems = pipe(document, querySelectorAll('li'), IOO.map(A.size))
 *
 * assert.deepStrictEqual(getNumListItems(), O.some(2))
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const querySelectorAll =
	(q: string) =>
	(x: ParentNode): IOOption<NonEmptyArray<Element>> =>
	() =>
		pipe(x, invoke("querySelectorAll")([q]), fromNodeList, NEA.fromArray)

/**
 * Returns all child nodes, if any, of a node.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { querySelector, childNodes } from 'fp-ts-std/DOM'
 * import { pipe } from 'fp-ts/function'
 * import * as IOO from 'fp-ts/IOOption'
 * import * as IO from 'fp-ts/IO'
 * import * as O from 'fp-ts/Option'
 * import * as A from 'fp-ts/Array'
 *
 * const { window: { document } } = new JSDOM('<ul><li>x</li><li>y</li></ul>')
 * const getNumChildren =
 *     pipe(document, querySelector('ul'), IOO.chain(childNodes), IOO.map(A.size))
 *
 * assert.deepStrictEqual(getNumChildren(), O.some(2))
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const childNodes =
	(x: Node): IOOption<NonEmptyArray<ChildNode>> =>
	() =>
		pipe(x.childNodes, fromNodeList, NEA.fromArray)

/**
 * Removes a child node from the tree.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { remove } from 'fp-ts-std/DOM'
 * import { IO } from 'fp-ts/IO'
 *
 * const before = '<p>x</p><p>y</p>'
 * const after = '<p>y</p>'
 *
 * const { window: { document } } = new JSDOM(before)
 *
 * const check: IO<string> = () => document.body.innerHTML
 * const removeFirstPara: IO<void> = remove(document.querySelector('p')!)
 *
 * assert.strictEqual(check(), before)
 * removeFirstPara()
 * assert.strictEqual(check(), after)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const remove =
	(x: ChildNode): IO<void> =>
	() =>
		pipe(x, invoke("remove")([]))

/**
 * Appends a node as a child of another.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { appendChild } from 'fp-ts-std/DOM'
 * import { IO } from 'fp-ts/IO'
 *
 * const before = '<p>x</p><p>y</p>'
 * const after = '<p>x</p><p>y</p><div></div>'
 *
 * const { window: { document } } = new JSDOM(before)
 *
 * const check: IO<string> = () => document.body.innerHTML
 * const addDiv: IO<void> = appendChild(document.createElement('div'))(document.body)
 *
 * assert.strictEqual(check(), before)
 * addDiv()
 * assert.strictEqual(check(), after)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const appendChild =
	(child: Node) =>
	(parent: Node): IO<void> =>
	() =>
		pipe(parent, invoke("appendChild")([child]))

/**
 * Removes all the child nodes, if any, of a given node.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { emptyChildren } from 'fp-ts-std/DOM'
 * import { IO } from 'fp-ts/IO'
 *
 * const before = '<div><span>x</span><p>y</p></div>'
 * const after = '<div></div>'
 *
 * const { window: { document } } = new JSDOM(before)
 *
 * const check: IO<string> = () => document.body.innerHTML
 * const emptyFirstDiv: IO<void> = emptyChildren(document.querySelector('div')!)
 *
 * assert.strictEqual(check(), before)
 * emptyFirstDiv()
 * assert.strictEqual(check(), after)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const emptyChildren: (x: Node) => IO<void> = flow(
	childNodes,
	IO.chain(O.traverse(IO.Applicative)(IO.traverseArray(remove))),
)

/**
 * Gets the text content, if any, of a node.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { getTextContent, setTextContent } from 'fp-ts-std/DOM'
 * import * as O from 'fp-ts/Option'
 *
 * const { window: { document } } = new JSDOM()
 * const el = document.createElement('div')
 * const check = getTextContent(el)
 *
 * assert.deepStrictEqual(check(), O.some(''))
 * setTextContent('x')(el)()
 * assert.deepStrictEqual(check(), O.some('x'))
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const getTextContent =
	(x: Node): IOOption<string> =>
	() =>
		pipe(x.textContent, O.fromNullable)

/**
 * Sets the text content of a node.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { getTextContent, setTextContent } from 'fp-ts-std/DOM'
 * import * as O from 'fp-ts/Option'
 *
 * const { window: { document } } = new JSDOM()
 * const el = document.createElement('div')
 * const check = getTextContent(el)
 *
 * assert.deepStrictEqual(check(), O.some(''))
 * setTextContent('x')(el)()
 * assert.deepStrictEqual(check(), O.some('x'))
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const setTextContent =
	(x: string) =>
	(y: Node): IO<void> =>
	() => {
		y.textContent = x
	}

type EventTarget = keyof WindowEventMap
type EventListener = (e: Event) => IO<void>
type EventListenerCleanup = IO<void>
/**
 * Adds an event listener to a node.
 * Returns a cleanup function for removing the event listener.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { addEventListener } from 'fp-ts-std/DOM'
 *
 * const { window: { document } } = new JSDOM()
 * const el = document.createElement('div')
 * let clicks = 0
 * const listen = addEventListener('click')(() => () => clicks++)(el)
 *
 * assert.strictEqual(clicks, 0)
 *
 * el.click()
 * assert.strictEqual(clicks, 0)
 *
 * const cleanupClickHandler = listen()
 * el.click()
 * assert.strictEqual(clicks, 1)
 *
 * el.click()
 * assert.strictEqual(clicks, 2)
 *
 * cleanupClickHandler()
 * el.click()
 * assert.strictEqual(clicks, 2)
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const addEventListener =
	(type: EventTarget) =>
	(listener: EventListener) =>
	(el: Node | Window): IO<EventListenerCleanup> =>
	() => {
		const _listener = (e: Event) => listener(e)()
		pipe(el, invoke("addEventListener")([type, _listener]))
		return () => pipe(el, invoke("removeEventListener")([type, _listener]))
	}

/**
 * Adds an event listener to a node.
 *
 * @example
 * import { JSDOM } from 'jsdom'
 * import { addEventListener_ } from 'fp-ts-std/DOM'
 *
 * const { window: { document } } = new JSDOM()
 * const el = document.createElement('div')
 * let clicks = 0
 * const listen = addEventListener_('click')(() => () => clicks++)(el)
 *
 * assert.strictEqual(clicks, 0)
 *
 * el.click()
 * assert.strictEqual(clicks, 0)
 *
 * listen()
 * el.click()
 * assert.strictEqual(clicks, 1)
 *
 * @category 3 Functions
 * @since 0.17.0
 */
export const addEventListener_ =
	(type: EventTarget) =>
	(listener: EventListener) =>
	(el: Node | Window): IO<void> =>
		pipe(addEventListener(type)(listener)(el), IO.map(constVoid))
