# CLI Application

This project is a simple command-line interface (CLI) application built with Node.js. It demonstrates the implementation of various CLI commands for file system operations, navigation, hashing, OS info, and more.

## Structure

- **src/cli/** — Core CLI logic, including command parsing and management
  - **commands/** — Implementations of individual commands (file system, hash, navigation, etc.)
  - **common/** — Common commands (Help, Exit)
  - **fileSystem/** — File system commands (Add, Cat, Cp, Mv, Rm, Rn)
  - **hash/** — Hash command
  - **navigate/** — Navigation commands (Cd, Ls, Up)
  - **os/** — OS-related commands
  - **zip/** — Zip commands
- **src/shared/** — Shared libraries and error handling

## Usage

Install dependencies:

```bash
npm install
```

Run the CLI application:

```bash
npm run start -- --username=your_username
```

You can then enter supported commands as described in the application's help output. Example commands:

- Navigation: `up`, `cd <path>`, `ls`
- File operations: `cat <file>`, `add <file>`, `rn <file> <newname>`, `cp <file> <dest>`, `mv <file> <dest>`, `rm <file>`
- OS info: `os --EOL`, `os --cpus`, `os --homedir`, `os --username`, `os --architecture`
- Hash: `hash <file>`
- Zip: `compress <file> <dest>`, `decompress <file> <dest>`
