{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    dhall
    dhall-json
    git
    nodejs-18_x
    yarn
  ];
}
