#!/usr/bin/env node

'use strict';

const args = require('minimist')(process.argv.slice(2));

function printUsage() {
  process.stdout.write(`Usage nacre:
  To launch a nacre shell, you don't need any argument:
    nacre
    
  To execute a nacre script:
    nacre myscript.js
    
  To get the version of nacre:
    nacre --version
`);
}

if (args.version || args.v) {
  const { version } = require('../package.json');
  process.stdout.write(version);
  process.exit(0);
}

if (args.help || args.h) {
  printUsage();
  process.exit(0);
}

if (args._.length === 0) {
  require('./repl');
}

if (args._.length === 1) {
  require('./global');
  const firstArg = args._[0];
  const filepath = require('path').resolve(firstArg);
  require(filepath);
  process.exit(0);
}
