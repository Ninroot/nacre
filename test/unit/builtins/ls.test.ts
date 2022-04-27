'use strict';

import { beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import path = require('path');

import ls = require('../../../src/builtins/ls');

describe('ls unit test', () => {
  beforeEach('move to fixtures directory', () => {
    process.chdir(path.join(__dirname, 'fixtures', 'ls'));
  });

  it('should return a non empty array when no args', () => {
    process.chdir(path.join('basic'));
    assert.deepStrictEqual(ls(), ['a', 'b']);
  });

  it('should return a non empty array when recursive', () => {
    process.chdir(path.join('recursive'));
    const actual = ls.recursive();
    const expected = [
      'd1',
      'd1/d11',
      'd1/d11/f11',
      'd1/d11/f12',
      'd1/f1',
      'd2',
      'd2/f21',
      'f1',
    ].map((p) => path.join(p));
    assert.deepStrictEqual(actual, expected);
  });

  it('should fail when ls a file which does not exist', () => {
    assert.throws(() => ls('fileThatDoesNot.Exist'));
  });
});
