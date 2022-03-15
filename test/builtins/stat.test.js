'use strict';

const { describe, it } = require('mocha');
const path = require('path');
const assert = require('assert/strict');

const stat = require('../../src/builtins/stat');

describe('stat unit test', () => {
  it('should recognize a basic directory', () => {
    const s = stat(path.join(__dirname, 'fixtures', 'stat', 'foo'));
    assert.equal(s.type, 'directory');
    assert.ok(s.size > 0);
    assert.ok(s.owner.length > 0);
  });
  it('should recognize a basic file', () => {
    const s = stat(path.join(__dirname, 'fixtures', 'stat', 'foo', 'empty.file'));
    assert.equal(s.type, 'file');
    assert.ok(s.size === 0);
    assert.ok(s.owner.length > 0);
  });
  it('should recognize a symbolic link file', () => {
    const s = stat(path.join(__dirname, 'fixtures', 'stat', 'symbolicLink.file'));
    assert.equal(s.type, 'symbolicLink');
  });
  it('should recognize a character file', () => {
    const s = stat(path.join('/dev', 'zero'));
    assert.equal(s.type, 'character');
  });
  it('should fail for non existing file', () => {
    assert.throws(() => stat(path.join(__dirname, 'fixtures', 'stat', 'foo', 'doesnotexist.file')));
  });
});
