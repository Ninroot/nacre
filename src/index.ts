#!/usr/bin/env node

import minimist = require("minimist");
import path = require("path");

import Inspector from "./lib/inspector";
import Repl from "./lib/repl";

const args = minimist(process.argv.slice(2));

function printUsage() {
  process.stdout.write(`Usage nacre:
  To launch a nacre shell, you don't need any argument:
    nacre
    
  To execute a nacre script:
    nacre myscript.js
    
  To evaluate a JavaScript command inline:
    nacre --evaluate 'console.log("Hello World")'
    
  To print the Nacre command line help:
    nacre --help
    
  To get the version of nacre:
    nacre --version
`);
}

if (args.version || args.v) {
  const { version } = require("../package.json");
  process.stdout.write(version);
  process.exit(0);
}

if (args.help || args.h) {
  printUsage();
  process.exit(0);
}

async function handle(line) {
  const inspector = new Inspector();
  await inspector.start();
  const result = await inspector.execute(line);
  process.stdout.write(`${result}\n`);
}

if (
  (args.evaluate && typeof args.evaluate === "string") ||
  (args.e && typeof args.e === "string")
) {
  const line = args.evaluate ? args.evaluate : args.e;
  handle(line)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

// REPL
if (args._.length === 0) {
  const repl = new Repl(process.stdin, process.stdout);
  repl.start();
}

// Script
if (args._.length === 1) {
  require("./global");
  const firstArg = args._[0];
  const filepath = path.resolve(firstArg);
  require(filepath);
  process.exit(0);
}
