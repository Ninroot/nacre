'use strict';

import {after, before, beforeEach, describe, it} from "mocha";

import * as assert from 'assert/strict'
import path = require('path');

import ls = require('../../src/builtins/ls');
import cd = require('../../src/builtins/cd');

describe('ls unit test', () => {
  let cwd;

  before('save current working directory', () => {
    cwd = process.cwd();
  });

  after('restore current working directory', () => {
    process.chdir(cwd);
  });

  beforeEach('move to current dir', () => {
    cd(__dirname);
  });
  it('should return a non empty array when no args', () => {
    cd(path.join(__dirname, 'fixtures', 'ls', 'basic'));
    assert.deepStrictEqual(ls(), ['a', 'b']);
  });
  it('should return a non empty array when recursive', () => {
    cd(path.join(__dirname, 'fixtures', 'ls', 'recursive'));
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
