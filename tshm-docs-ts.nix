# This is a bit lazy at the moment, supporting only Linux x86_64 and assuming
# the need to patch dynamic links for NixOS.

{ fetchurl, lib, pkgs, stdenv }:

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

  preFixup =
    let
      patchelf = "${pkgs.patchelf}/bin/patchelf";
      linker = stdenv.cc.bintools.dynamicLinker;
      libPath = with pkgs; lib.makeLibraryPath [ gmp ];
    in
    ''
      ${patchelf} --set-interpreter ${linker} --set-rpath ${libPath} $out/bin/tshm-docs-ts
    '';

  meta = {
    homepage = "https://github.com/samhh/tshm";
    license = lib.licenses.mit;
  };
}
