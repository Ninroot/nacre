# Nacre

[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)

Nacre is an **object-oriented shell** whose motto is **intuitiveness**. 

Nacre does not aim to make you learn another shell language but instead leverages the full potential of Javascript.
Because every command returns JSON, you manipulate objects instead of parsing raw lines.

We rather encourage experimenting rather than reading endless documentation. For example if you wish to know how to use
`cd`, run it and explore using autocompletion.

https://user-images.githubusercontent.com/11426226/152829546-8acdf310-d339-4f6e-ae1d-69154b97ac01.mp4

## Usage

### Install

You must have [NodeJS](https://nodejs.org/en/) installed on your system. Once this is done, you can install nacre:
```shell
$ npm install -g nacre
```

To launch a nacre shell:
```shell
$ nacre
```

You can also run a nacre script file (see [an example](./test/nacre-script.js)):
```shell
$ nacre myscript.js
```

### Examples

```js
// returns an array of the files and directories of the working directory like:
> ls()
  [ 'basic', 'empty', 'recursive', 'recursive_simple' ]
// returns an array of the files and directories of the working directory like:
> ls.recursive()
  [
    'basic',
    'basic/a',
    'basic/b',
    'empty',
    'recursive',
    'recursive/d1',
    'recursive/d1/d11',
    'recursive/d1/d11/f11',
    'recursive/d1/d11/f12',
    'recursive/d1/d12',
    'recursive/d1/f1',
    'recursive/d2',
    'recursive/d2/f21',
    'recursive/f1',
    'recursive_simple',
    'recursive_simple/d1',
    'recursive_simple/d1/f1',
    'recursive_simple/d1/f2'
  ]
// get status of each file 
> ls.recursive().map(stat)
  [
  {
    name: 'basic',
    type: 'directory',
    size: 128,
    createdAt: 2022-02-07T11:16:23.285Z,
    modifiedAt: 2022-02-07T11:16:39.576Z,
    owner: 'arnauddebec',
    group: 'staff'
  },
  {
    name: 'a',
      type: 'file',
    size: 0,
    createdAt: 2022-02-07T11:16:30.806Z,
    modifiedAt: 2022-02-07T11:16:30.806Z,
    owner: 'arnauddebec',
    group: 'staff'
  },
  ...
```

## Available commands

- `ls`
- `cd`
- `sh`
- `stat`
- `pwd`
- `mkdir`
- `npm`
``
## Support

[StackOverflow](https://stackoverflow.com/questions/tagged/nacre)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).

## Roadmap
Subject to change.

### Alpha 0.0.3
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

### Alpha 0.0.4
- [x] implement basic `stat` builtin
- [x] enable nacre to launch nacre script from file
- [x] implement basic `mkdir` builtin
- [x] implement basic `pwd` builtin

### In progress (Main branch)
- [x] get closing braces, brackets, parentheses, single quote, double quote & backtiks automatically when opening one

### Backlog
- [ ] distinguish the return of a value (json) from the stdout (frontend)
- [ ] implement basic `cat` builtin (?)
- [ ] implement basic `copy` builtin
- [ ] implement basic `mv` builtin
- [ ] equivalent of cmd + shift + p to find an action in VSCode but to find a command (ctrl + f?)
- [ ] implement basic `curl` (fetch ?)
- [ ] implement basic `sudo` (?)
- [ ] implement basic `ln` (?)
- [ ] implement basic `which` (?)
- [ ] implement basic `df`
- [ ] implement basic `du`
- [ ] implement basic `jobs`
- [ ] implement basic `kill`
- [ ] implement basic `npm` (?)
- [ ] implement basic `history`
- [ ] implement basic `bash` behaviours (auto completion). Maybe by opening a bash / zsh shell to get the command and returning it to json
- [ ] implement basic `rm`
- [ ] implement basic `touch`
- [ ] implement basic `chmod` (permission)
- [ ] implement basic `chown` (group)
- [ ] implement basic `user`
- [ ] implement basic `find` (?)
- [ ] implement basic `grep` (?)
- [ ] implement basic `systemd`
- [ ] implement basic `mount`
- [ ] implement basic `ping`
- [ ] implement basic `yum`
- [ ] implement basic `apt`
- [ ] implement basic `dnf`
- [ ] implement basic `git`
