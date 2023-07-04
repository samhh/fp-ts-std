{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          overlay = _final: super: {
            tshm-docs-ts = super.callPackage ./tshm-docs-ts.nix { };
          };

          pkgs = import nixpkgs {
            inherit system;
            overlays = [ overlay ];
          };

          common = with pkgs; [ git sd yarn tshm-docs-ts ];
        in
        {
          devShells = {
            default = pkgs.mkShell {
              nativeBuildInputs = with pkgs; [ nodejs_20 ] ++ common;
            };

            lts = pkgs.mkShell {
              nativeBuildInputs = with pkgs; [ nodejs ] ++ common;
            };
          };
        }
      );
}
