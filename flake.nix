{
  description = "A Nix flake to configure repo dependencies and environment.";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        libraries = with pkgs; [
          cairo
          dbus
          gdk-pixbuf
          glib
          gtk3
          librsvg
          openssl_3
          webkitgtk
        ];
        packages = with pkgs; [
          cargo
          curl
          dbus
          glib
          gtk3
          librsvg
          libsoup
          nodejs_20
          pkg-config
          rustc
          rustfmt
          rustPackages.clippy
          yarn
          webkitgtk
          wget
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = packages;
          shellHook = ''
            export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
            export XDG_DATA_DIRS=${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:$XDG_DATA_DIRS
          '';
        };
      });
}
