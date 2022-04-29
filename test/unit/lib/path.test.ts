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
      assert.isTrue(path.isDir('\\'));
      assert.isTrue(path.isDir('C:\\'));
      assert.isFalse(path.isDir('C:\\foo'));
      assert.isTrue(path.isDir('C:\\foo\\'));
    } else {
      assert.isTrue(path.isDir('/'));
    }
  });

  it('dirPath', () => {
    assert.equal(path.dirPath('foo'), '.');
    if (platform === 'win32') {
      assert.equal(path.dirPath('dir\\'), 'dir');
      assert.equal(path.dirPath('dir/file'), 'dir');
      assert.equal(path.dirPath('\\dir'), '\\');
      assert.equal(path.dirPath('C:\\'), 'C:\\');
      assert.equal(path.dirPath('C:\\foo\\'), 'C:\\foo');
      assert.equal(path.dirPath('\\'), '\\');
    } else {
      assert.equal(path.dirPath('dir/'), 'dir');
      assert.equal(path.dirPath('dir/file'), 'dir');
      assert.equal(path.dirPath('/dir'), '/');
      assert.equal(path.dirPath('/dir/foo'), '/dir');
      assert.equal(path.dirPath('/dir/foo/'), '/dir/foo');
      assert.equal(path.dirPath('/'), '/');
    }
  });
});
