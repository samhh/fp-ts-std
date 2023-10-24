# This is a bit lazy at the moment, supporting only Linux x86_64.

{ fetchurl, lib, stdenv }:

stdenv.mkDerivation rec {
  pname = "tshm-docs-ts";
  version = "0.4.2";

  src = fetchurl {
    url = "https://github.com/samhh/tshm/releases/download/${version}/tshm-docs-ts-${version}-linux-x86_64";
    sha256 = "128skc68bkcfc0bg0xjwd9dn9203by70dzvr6ki9nhr3qvggnf2p";
  };

  dontUnpack = true;
  dontStrip = true;

  installPhase = ''
    mkdir -p $out/bin/
    cp $src $out/bin/tshm-docs-ts
    chmod +x $out/bin/tshm-docs-ts
  '';

  meta = {
    homepage = "https://github.com/samhh/tshm";
    license = lib.licenses.mit;
    platforms = [ "x86_64-linux" ];
  };
}
