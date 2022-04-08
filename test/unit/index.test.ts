'use strict';

import {after, before, describe, it} from "mocha";
import { spawn } from 'child_process';

import assert = require('assert/strict');
import path = require('path');

let cwd;

before('save current working directory', () => {
  cwd = process.cwd();
});

after('restore current working directory', () => {
  process.chdir(cwd);
});

function run(...args): any {
  return new Promise((res) => {
    const proc = spawn(process.execPath, [path.join(cwd, 'built', 'src', 'index.js'), ...args]);
    const out = [];
    const err = [];
    proc.stdout.on('data', (data) => out.push(data));
    proc.stderr.on('data', (data) => err.push(data));
    proc.on('close', (code, signal) => {
      res({
        code,
        signal,
        stdout: Buffer.concat(out)
          .toString('utf8'),
        stderr: Buffer.concat(err)
          .toString('utf8'),
      });
    });
  });
}

describe('index unit test', () => {
  it('--help', async () => {
    const actual = await run('--help');
    assert.ok(actual.stdout.includes('Usage'), `Should be ${actual.stdout}`);
  });

  it('--evaluate 1+1', async () => {
    const actual = await run('--evaluate', '1+1');
    assert.ok(actual.stdout.includes('2'), `Should be ${actual.stdout}`);
  });
});
