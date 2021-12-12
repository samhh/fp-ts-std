---
title: DOM.ts
nav_order: 7
parent: Modules
---

## DOM overview

This module provides some essential DOM bindings. Technically this module
doesn't make any assumptions about your environment, so just as it will work
in the browser over say `document`, it will also work for anything else
that's standards-compliant, such as {@link https://github.com/jsdom/jsdom jsdom}.

Added in v0.12.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [addEventListener](#addeventlistener)
  - [appendChild](#appendchild)
  - [childNodes](#childnodes)
  - [emptyChildren](#emptychildren)
  - [fromNodeList](#fromnodelist)
  - [getTextContent](#gettextcontent)
  - [querySelector](#queryselector)
  - [querySelectorAll](#queryselectorall)
  - [remove](#remove)
  - [setTextContent](#settextcontent)

---

# utils

## addEventListener

Adds an event listener to a node.

**Signature**

```ts
export declare const addEventListener: (type: string) => (f: (evt: Event) => IO<void>) => (x: Node) => IO<void>
```

```hs
addEventListener :: string -> (Event -> IO void) -> Node -> IO void
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { addEventListener } from 'fp-ts-std/DOM'

const {
  window: { document },
} = new JSDOM()
const el = document.createElement('div')
let clicks = 0
const listen = addEventListener('click')(() => () => clicks++)(el)

assert.strictEqual(clicks, 0)

el.click()
assert.strictEqual(clicks, 0)

listen()
el.click()
assert.strictEqual(clicks, 1)

el.click()
assert.strictEqual(clicks, 2)
```

Added in v0.12.0

## appendChild

Appends a node as a child of another.

**Signature**

```ts
export declare const appendChild: (child: Node) => (parent: Node) => IO<void>
```

```hs
appendChild :: Node -> Node -> IO void
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { appendChild } from 'fp-ts-std/DOM'
import { IO } from 'fp-ts/IO'

const before = '<p>x</p><p>y</p>'
const after = '<p>x</p><p>y</p><div></div>'

const {
  window: { document },
} = new JSDOM(before)

const check: IO<string> = () => document.body.innerHTML
const addDiv: IO<void> = appendChild(document.createElement('div'))(document.body)

assert.strictEqual(check(), before)
addDiv()
assert.strictEqual(check(), after)
```

Added in v0.12.0

## childNodes

Returns all child nodes, if any, of a node.

**Signature**

```ts
export declare const childNodes: (x: Node) => IO<Option<NonEmptyArray<ChildNode>>>
```

```hs
childNodes :: Node -> IO (Option (NonEmptyArray ChildNode))
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { querySelector, childNodes } from 'fp-ts-std/DOM'
import { pipe } from 'fp-ts/function'
import * as IOO from 'fp-ts-contrib/IOOption'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'

const {
  window: { document },
} = new JSDOM('<ul><li>x</li><li>y</li></ul>')
const getNumChildren = pipe(document, querySelector('ul'), IOO.chain(childNodes), IOO.map(A.size))

assert.deepStrictEqual(getNumChildren(), O.some(2))
```

Added in v0.12.0

## emptyChildren

Removes all the child nodes, if any, of a given node.

**Signature**

```ts
export declare const emptyChildren: (x: Node) => IO<void>
```

```hs
emptyChildren :: Node -> IO void
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { emptyChildren } from 'fp-ts-std/DOM'
import { IO } from 'fp-ts/IO'

const before = '<div><span>x</span><p>y</p></div>'
const after = '<div></div>'

const {
  window: { document },
} = new JSDOM(before)

const check: IO<string> = () => document.body.innerHTML
const emptyFirstDiv: IO<void> = emptyChildren(document.querySelector('div')!)

assert.strictEqual(check(), before)
emptyFirstDiv()
assert.strictEqual(check(), after)
```

Added in v0.12.0

## fromNodeList

Convert a `NodeList` into an `Array`.

**Signature**

```ts
export declare const fromNodeList: <A extends Node>(xs: NodeListOf<A>) => A[]
```

```hs
fromNodeList :: a extends Node => NodeListOf a -> Array a
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { fromNodeList } from 'fp-ts-std/DOM'

const {
  window: { document },
} = new JSDOM('irrelevant')
const xs = document.querySelectorAll('div')

assert.strictEqual(Array.isArray(xs), false)
assert.strictEqual(Array.isArray(fromNodeList(xs)), true)
```

Added in v0.12.0

## getTextContent

Gets the text content, if any, of a node.

**Signature**

```ts
export declare const getTextContent: (x: Node) => IO<Option<string>>
```

```hs
getTextContent :: Node -> IO (Option string)
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { getTextContent, setTextContent } from 'fp-ts-std/DOM'
import * as O from 'fp-ts/Option'

const {
  window: { document },
} = new JSDOM()
const el = document.createElement('div')
const check = getTextContent(el)

assert.deepStrictEqual(check(), O.some(''))
setTextContent('x')(el)()
assert.deepStrictEqual(check(), O.some('x'))
```

Added in v0.12.0

## querySelector

Returns the first descendent element of the input node matching the provided
selector.

**Signature**

```ts
export declare const querySelector: (q: string) => (x: ParentNode) => IO<Option<Element>>
```

```hs
querySelector :: string -> ParentNode -> IO (Option Element)
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { querySelector, getTextContent } from 'fp-ts-std/DOM'
import { pipe } from 'fp-ts/function'
import * as IOO from 'fp-ts-contrib/IOOption'
import * as O from 'fp-ts/Option'

const {
  window: { document },
} = new JSDOM('<ul><li>x</li><li>y</li></ul>')
const f = (x: string) => pipe(document, querySelector(x), IOO.chain(getTextContent))

assert.deepStrictEqual(f('li:nth-child(1)')(), O.some('x'))
assert.deepStrictEqual(f('li:nth-child(2)')(), O.some('y'))
assert.deepStrictEqual(f('li:nth-child(3)')(), O.none)
```

Added in v0.12.0

## querySelectorAll

Returns every descendent element of the input node matching the provided
selector.

**Signature**

```ts
export declare const querySelectorAll: (q: string) => (x: ParentNode) => IO<Option<NonEmptyArray<Element>>>
```

```hs
querySelectorAll :: string -> ParentNode -> IO (Option (NonEmptyArray Element))
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { querySelectorAll } from 'fp-ts-std/DOM'
import { pipe } from 'fp-ts/function'
import * as IOO from 'fp-ts-contrib/IOOption'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'

const {
  window: { document },
} = new JSDOM('<ul><li>x</li><li>y</li></ul>')
const getNumListItems = pipe(document, querySelectorAll('li'), IOO.map(A.size))

assert.deepStrictEqual(getNumListItems(), O.some(2))
```

Added in v0.12.0

## remove

Removes a child node from the tree.

**Signature**

```ts
export declare const remove: (x: ChildNode) => IO<void>
```

```hs
remove :: ChildNode -> IO void
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { remove } from 'fp-ts-std/DOM'
import { IO } from 'fp-ts/IO'

const before = '<p>x</p><p>y</p>'
const after = '<p>y</p>'

const {
  window: { document },
} = new JSDOM(before)

const check: IO<string> = () => document.body.innerHTML
const removeFirstPara: IO<void> = remove(document.querySelector('p')!)

assert.strictEqual(check(), before)
removeFirstPara()
assert.strictEqual(check(), after)
```

Added in v0.12.0

## setTextContent

Sets the text content of a node.

**Signature**

```ts
export declare const setTextContent: (x: string) => (y: Node) => IO<void>
```

```hs
setTextContent :: string -> Node -> IO void
```

**Example**

```ts
import { JSDOM } from 'jsdom'
import { getTextContent, setTextContent } from 'fp-ts-std/DOM'
import * as O from 'fp-ts/Option'

const {
  window: { document },
} = new JSDOM()
const el = document.createElement('div')
const check = getTextContent(el)

assert.deepStrictEqual(check(), O.some(''))
setTextContent('x')(el)()
assert.deepStrictEqual(check(), O.some('x'))
```

Added in v0.12.0
