'use strict';

import { describe, it } from 'mocha';
import { assert } from 'chai';
import { platform } from 'process';
import path = require('../../../src/lib/path');

describe('path unit test', () => {
  it('isDir', () => {
    assert.isFalse(path.isDir(''));
    assert.isFalse(path.isDir('foo'));
    assert.isFalse(path.isDir('.'));
    if (platform === 'win32') {
      assert.isTrue(path.isDir('C:\\\\'));
    } else {
      assert.isTrue(path.isDir('/'));
    }
  });

  it('dirPath', () => {
    assert.equal(path.dirPath('foo'), '.');
    assert.equal(path.dirPath('dir/'), 'dir');
    assert.equal(path.dirPath('dir/file'), 'dir');
    assert.equal(path.dirPath('/dir'), '/');
    assert.equal(path.dirPath('/'), '/');
  });
});
