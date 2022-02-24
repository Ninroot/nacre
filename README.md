# Nacre

[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)

[Nacre](https://nacre.sh/) is an open source **object-oriented shell** leveraging the full potential of **JavaScript** for those who prefer to work with objects rather than text. The project relies on NodeJS.

## Installation

[Getting started](https://nacre.sh/getting-started).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).

## Roadmap
Subject to change.

### Alpha
- [x] get a readline where we can move the cursor left/right --> nodejs/repl 
- [x] calling basic js function such as console.log
- [x] getting the result of the execution printed
- [x] autocompletion of available function
- [x] autocompletion of available property of object
- [x] auto import of custom function such as ls
- [x] implement basic `ls` builtin
- [x] implement basic `cd` builtin
- [x] implement basic `sh` builtin
- [x] better builtins importation
- [x] implement basic `npm` command acting as a binary which takes a json as input and outputs json
- [x] implement basic `stat` builtin
- [x] enable nacre to launch nacre script from file
- [x] implement basic `mkdir` builtin
- [x] implement basic `pwd` builtin
- [x] get closing braces, brackets, parentheses, single quote, double quote & backtiks automatically when opening one
- [x] implement basic `mv` builtin
- [x] implement basic `touch`
- [x] implement basic `chmod` (permission)

### In progress (Main branch)

### Backlog
- [ ] implement basic `rm`
- [ ] equivalent of cmd + shift + p to find an action in VSCode but to find a command (ctrl + f?)
- [ ] Path completion
- [ ] Auto require
- [ ] implement basic `sudo` (?)
- [ ] implement basic `cat` builtin (?)
- [ ] implement basic `copy` builtin
- [ ] distinguish the return of a value (json) from the stdout (frontend)
- [ ] implement basic `chown` (group)
- [ ] implement basic `which` (?)
- [ ] implement basic `user`
- [ ] implement basic `grep` (?)
- [ ] implement basic `find` (?)
- [ ] implement basic `history`
- [ ] implement basic `curl` (fetch ?)
- [ ] implement basic `ln` (?)
- [ ] implement basic `df`
- [ ] implement basic `du`
- [ ] implement basic `jobs`
- [ ] implement basic `kill`
- [ ] implement basic `bash` behaviours (auto completion). Maybe by opening a bash / zsh shell to get the command and returning it to json
- [ ] implement basic `systemd`
- [ ] implement basic `mount`
- [ ] implement basic `ping`
- [ ] implement basic `yum`
- [ ] implement basic `apt`
- [ ] implement basic `dnf`
- [ ] implement basic `git`
