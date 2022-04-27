'use strict';

import { describe, before, it } from 'mocha';
import { execSync } from 'child_process';
import { assert } from 'chai';
import path = require('path');
import {ls} from "../../../src/builtins";

describe('scripting unit test', () => {
  it('should import pwd builtin', () => {
    const appDir = path.join(__dirname, '../../..');
    console.log({appDir});
    const rec = ls.recursive(appDir);
    console.log({rec})
    const actual = execSync(
      'node ./bin/index.js ./test/unit/lib/fixtures/scripting/pwd.js',
      { cwd: appDir },
    );
    assert.include(actual.toString(), appDir);
  });
});
