'use strict';

import { describe, after, before, it } from 'mocha';
import { execSync } from 'child_process';
import { assert } from 'chai';

let cwd;

before('save current working directory', () => {
  cwd = process.cwd();
});

after('restore current working directory', () => {
  process.chdir(cwd);
});

describe('scripting unit test', () => {
  it('should import pwd builtin', () => {
    console.log('CWD:', cwd);
    const actual = execSync(
      'node ./built/src/index.js ./built/test/unit/lib/fixtures/scripting/pwd.js',
      { cwd },
    );
    assert.include(actual.toString(), cwd);
  });
});
