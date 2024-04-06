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
        in
        {
          devShells = rec {
            default = pkgs.mkShell {
              inputsFrom = [ nodejs-latest lint ];

              nativeBuildInputs = with pkgs; [
                tshm-docs-ts
              ];
            };

            nodejs-latest = pkgs.mkShell {
              nativeBuildInputs = with pkgs; [
                nodejs_21
                nodePackages.pnpm
              ];
            };

            nodejs-lts = pkgs.mkShell {
              nativeBuildInputs = with pkgs; [
                nodejs
                nodePackages.pnpm
              ];
            };

            bun-latest = pkgs.mkShell {
              nativeBuildInputs = with pkgs; [
                bun
                nodePackages.pnpm
              ];
            };

            lint = pkgs.mkShell {
              nativeBuildInputs = with pkgs; [
                biome
              ];
            };
          };
        }
      );
}
