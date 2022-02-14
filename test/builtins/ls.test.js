'use strict';

const { describe, it, beforeEach } = require('mocha');
const assert = require('assert/strict');
const path = require('path');

const ls = require('../../src/builtins/ls');
const cd = require('../../src/builtins/cd');

describe('ls unit test', () => {
  beforeEach('move to current dir', () => {
    cd(__dirname);
  });
  it('should return a non empty array when no args', () => {
    cd(path.join(__dirname, 'fixtures', 'ls', 'basic'));
    assert.deepStrictEqual(ls(), ['a', 'b']);
  });
  it('should return a non empty array when path provided', () => {
    cd(path.join(__dirname, 'fixtures', 'ls'));
    assert.deepStrictEqual(ls('empty'), []);
  });
  it('should return a non empty array when recursive', () => {
    cd(path.join(__dirname, 'fixtures', 'ls', 'recursive'));
    const actual = ls.recursive();
    const expected = [
      'd1',
      'd1/d11',
      'd1/d11/f11',
      'd1/d11/f12',
      'd1/d12',
      'd1/f1',
      'd2',
      'd2/f21',
      'f1',
    ];
    assert.deepStrictEqual(actual, expected);
  });
  it('should fail when ls a file which does not exist', () => {
    assert.throws(() => ls('fileThatDoesNot.Exist'));
  });
});
