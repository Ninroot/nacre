'use strict';

import { describe, before, it } from 'mocha';
import { execSync } from 'child_process';
import { assert } from 'chai';
import path = require('path');

describe('scripting unit test', () => {
  before('move to fixtures directory', () => {
    process.chdir(path.join(__dirname));
  });

  it('should import pwd builtin', () => {
    const appDir = path.join(process.cwd(), '../../..');
    const actual = execSync(
      'node ./built/src/index.js ./built/test/unit/lib/fixtures/scripting/pwd.js',
      { cwd: appDir },
    );
    assert.include(actual.toString(), appDir);
  });
});
