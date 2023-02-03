# fp-ts-std

The missing pseudo-standard library for [fp-ts](https://gcanti.github.io/fp-ts/).

Documentation: [samhh.github.io/fp-ts-std](https://samhh.github.io/fp-ts-std/)

## Installation

The library is available on the npm registry under the same package name: [fp-ts-std](https://www.npmjs.com/package/fp-ts-std)

fp-ts, [newtype-ts](https://gcanti.github.io/newtype-ts/), and [monocle-ts](https://gcanti.github.io/monocle-ts/) are listed as peer dependencies.

fp-ts-std is published with both ESM and CJS modules. The import paths in either case needn't change and the appropriate module resolution should be picked up by Node and your bundler, however if your environment doesn't support [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) you'll need to import directly from a `dist/(cjs|esm)/` subdirectory. Given ESM modules the library should tree shake well.

Node LTS - at time of writing v18 - and the latest evergreen browsers are supported.

## Objectives

fp-ts-std aims to achieve the following objectives:

- Flesh out what fp-ts is missing
- Fill in the gaps between fp-ts and Ramda
- Wrap JS APIs to be friendly, so that you never have to interact with `null` or `undefined`, or worry about a function throwing again

## Ethos

fp-ts-std strives to adhere to the following principles:

- Strict type-safety wherever possible, with risks well documented
- All functions are curried
- Functions are data-last as a rule
- Functions are total unless explicitly prefixed with "unsafe" (with the exception of the `Debug` module)
- Impure functions are appropriately signed with the `IO` and `Task` types
- Lean towards Haskell naming conventions and idioms with an eye to fp-ts norms

Additionally, fp-ts-std enforces 100% testing coverage, and just about everything is documented with examples.

## Contributing

Unreleased work is commit to the `develop` branch. `master` is the release branch and whence the documentation is generated.

All modules and exports must be annotated with JSDoc. This information is used to generate documentation. Simple, illustratory tests can also be included and will be checked during docs generation. For more information, see [docs-ts](https://github.com/gcanti/docs-ts).
