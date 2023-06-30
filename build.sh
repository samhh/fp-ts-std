#!/bin/sh

set -x

rm -rf ./dist/

mkdir -p ./dist/esm/ ./dist/cjs/

tsc -p ./tsconfig.build-esm.json
tsc -p ./tsconfig.build-cjs.json
tsc -p ./tsconfig.build-types.json
