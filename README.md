# Streambrah - The OBS-like App for Streaming Video on Nostr

## Getting Started

### Install Nix package manager

- Use this command to install the Nix package manager on your Unix-like system (Linux/MacOS/WSL):
```shell
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
````
You can read more about the installer [here](https://zero-to-nix.com/concepts/nix-installer).

### Activate Development Shell

- In the project directory, use this command:
```shell
nix develop
```
The dependencies will be downloaded/installed in a contained environment, and your development shell will be loaded.

### Start The Development Server
```bash
yarn tauri dev
```
The app will launch a new window with the GUI.
