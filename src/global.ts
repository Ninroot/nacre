'use strict';

import builtins = require('./builtins');
import commands = require('./commands');

global.module = module;
global.require = require;
global.path = require('path');
global.util = require('util');

// list of builtins to be excluded from some OS
const excluded = process.platform === 'win32' ? ['chmod', 'chown'] : [];

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
  .filter(builtin => !excluded.includes(builtin))
  .forEach((builtin) => {
    global[builtin] = builtins[builtin];
  });

Object.keys(commands)
  .forEach((command) => {
    global[command] = commands[command];
  });
