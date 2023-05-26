---
title: Facades import strategy
nav_order: 3
---

# Facades import strategy

Importing from fp-ts, fp-ts-std, other libraries, and your own modules can quickly become tedious. The "facades" import strategy can alleviate this.

Define your own utilities directory and place modules like `Array` in there. Place the following in the files:

```ts
export * from 'fp-ts/Array';
export * from 'fp-ts-std/Array';

// Your own stuff here
```

Now simply import from these modules instead! You may wish to set up an alias for your directory to make this more ergonomic within deeply nested directories.

## Conflicts

fp-ts-std generally tries to avoid naming conflicts, however they do exist in rare cases. When this occurs you'll have to specify which import you'd like to prioritise with a final named export:

```ts
export * from 'fp-ts/Array';
export * from 'fp-ts-std/Array';
export { thing } from 'fp-ts/Array';
```
