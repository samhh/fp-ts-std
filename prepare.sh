#!/bin/sh

rm -rf dist
mkdir -p dist/esm dist/cjs

cat > dist/esm/package.json << EOF
{
  "type": "module"
}
EOF

cat > dist/cjs/package.json << EOF
{
  "type": "commonjs"
}
EOF

