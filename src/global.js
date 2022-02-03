'use strict';

const builtins = require('./builtins');
const commands = require('./commands');

Object.keys(builtins).forEach((builtin) => {
  global[builtin] = builtins[builtin];
});

Object.keys(commands).forEach((command) => {
  global[command] = commands[command];
});
