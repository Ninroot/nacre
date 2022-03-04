'use strict';

const {
  it,
  before,
  after,
} = require('mocha');
const assert = require('assert/strict');
const { execSync } = require('child_process');

let cwd;

before('save current working directory', () => {
  cwd = process.cwd();
});

after('restore current working directory', () => {
  process.chdir(cwd);
});

describe('scripting unit test', () => {
  it('should import pwd builtin', () => {
    const actual = execSync('node ./src/index.js ./test/lib/fixtures/scripting/pwd.js', { cwd });
    assert.ok(actual.toString().includes(cwd));
  });
});
