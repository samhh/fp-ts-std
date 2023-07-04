#!/bin/sh

set -x

rm -rf ./docs-workdir/
mkdir ./docs-workdir/

cp -r package.json tsconfig.json docs-ts.json ./src/ ./docs/ ./docs-workdir/
ln -rs ./node_modules/ ./docs-workdir/node_modules

sd '"type": "module"' '"type": "commonjs"' ./docs-workdir/package.json
sd '"moduleResolution": "node16"' '"moduleResolution": "node"' ./docs-workdir/tsconfig.json
sd 'from "(.+).js"$' 'from "$1"' ./docs-workdir/src/*.ts

(cd ./docs-workdir/; yarn run docs-ts)

rm -rf ./docs/
mv ./docs-workdir/docs/ ./docs
