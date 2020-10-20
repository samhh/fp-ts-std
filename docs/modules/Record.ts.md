---
title: Record.ts
nav_order: 11
parent: Modules
---

## Record overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [lookupFlipped](#lookupflipped)
  - [omit](#omit)
  - [pick](#pick)
  - [values](#values)

---

# utils

## lookupFlipped

Like `lookup` from fp-ts, but flipped.

**Signature**

```ts
export declare const lookupFlipped: <A>(x: Record<string, A>) => (k: string) => Option<A>
```

Added in v0.1.0

## omit

Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
type.

**Signature**

```ts
export declare const omit: <K extends string>(
  ks: K[]
) => <V, A extends Record<K, V>>(x: A) => Pick<A, Exclude<keyof A, K>>
```

Added in v0.1.0

## pick

Pick a set of keys from a `Record`. The value-level equivalent of the `Pick`
type.

**Signature**

```ts
export declare const pick: <A>() => <K extends keyof A>(ks: K[]) => (x: A) => Pick<A, K>
```

Added in v0.1.0

## values

Get the values from a `Record`.

**Signature**

```ts
export declare const values: <A>(x: Record<string, A>) => A[]
```

Added in v0.1.0
