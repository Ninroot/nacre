'use strict';

const builtins = require('./builtins');
const commands = require('./commands');

global.module = module;
global.require = require;
global.util = require('util');

Object.defineProperty(globalThis, '_', {
  value: undefined,
  writable: true,
  enumerable: false,
  configurable: true,
});

Object.defineProperty(globalThis, '_err', {
  value: undefined,
  writable: true,
  enumerable: false,
  configurable: true,
});

Object.keys(builtins)
  .forEach((builtin) => {
    global[builtin] = builtins[builtin];
  });

Object.keys(commands)
  .forEach((command) => {
    global[command] = commands[command];
  });
