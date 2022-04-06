'use strict';

import {describe, after, before, it} from "mocha";
import { execSync } from 'child_process';
import assert = require('assert/strict');

let cwd;

before('save current working directory', () => {
  cwd = process.cwd();
});

after('restore current working directory', () => {
  process.chdir(cwd);
});

describe('scripting unit test', () => {
  it('should import pwd builtin', () => {
    const actual = execSync('node ./built/index.js ./test/unit/lib/fixtures/scripting/pwd.js', { cwd });
    assert.ok(actual.toString().includes(cwd));
  });
});
