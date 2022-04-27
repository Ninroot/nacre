'use strict';

import { describe, it } from 'mocha';
import { execSync } from 'child_process';
import { assert } from 'chai';
import path = require('path');

describe('scripting unit test', () => {
  it('should import pwd builtin', () => {
    const appDir = path.join(__dirname, '../../..');
    const actual = execSync(
      'node ./bin/index.js ./test/unit/lib/fixtures/scripting/pwd.js',
      { cwd: appDir },
    );
    assert.include(actual.toString(), appDir);
  });
});
