# Changelog

This project adheres to semantic versioning.

## _Unreleased_

- Remove unneeded `newtype-ts` peer dependency. This may be added back in the future if and when we are actively utilising it.
- Upgrade `upsert` function in the `Array` module to return a `NonEmptyArray`.
- Remove `undefined` as acceptable input to `stringifyPrimitive` function in the `JSON` module.

## 0.2.0 (2020-10-19)

- Add `Debug` module.
- Add `URLSearchParams` module.
- Add more arithmetic functions to the `Number` module.
- Add `exec` function to the `String` module.

## 0.1.2 (2020-10-19)

- Fix broken `getParam` type signature. It was incorrectly marked as effectful.
- Fix broken `setParam` definition. It previously mistakenly mutated its input.

## 0.1.1 (2020-10-19)

- Fix broken `unlines` definition.
- Amend `surround` to only take a single argument describing the "surroundings".

## 0.1.0 (2020-10-19)

- Initial release.

