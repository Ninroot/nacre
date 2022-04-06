'use strict';

import {describe, it} from "mocha";

import path = require('path');
import * as assert from 'assert/strict'

import stat = require('../../../src/builtins/stat');

describe('stat unit test', () => {
  const windows = process.platform === 'win32';

  function testOwnership(statFile) {
    if (windows) {
      assert.equal(typeof statFile.owner, 'undefined');
    } else {
      assert.equal(typeof statFile.owner, 'string');
    }
  }

  it('should recognize a basic directory', () => {
    const s = stat(path.join(__dirname, 'fixtures', 'stat', 'foo'));
    assert.equal(s.type, 'directory');
    assert.equal(typeof s.size, 'number');
    testOwnership(s);
  });

  it('should recognize a basic file', () => {
    const s = stat(path.join(__dirname, 'fixtures', 'stat', 'foo', 'empty.file'));
    assert.equal(s.type, 'file');
    testOwnership(s);
  });

  it('should recognize a symbolic link file', () => {
    const s = stat(path.join(__dirname, 'fixtures', 'stat', 'symbolicLink.file'));
    assert.equal(s.type, 'symbolicLink');
  });

  // eslint-disable-next-line func-names
  it('should recognize a character file', function () {
    if (windows) {
      this.skip();
    }
    const s = stat(path.join('/dev', 'zero'));
    assert.equal(s.type, 'character');
  });

  it('should fail for non existing file', () => {
    assert.throws(() => stat(path.join(__dirname, 'fixtures', 'stat', 'foo', 'doesnotexist.file')));
  });
});
