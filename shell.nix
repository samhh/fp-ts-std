{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    git
    nodejs-18_x
    yarn
  ];
}
