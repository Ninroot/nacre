'use strict';

const { describe, it, before, after } = require('mocha');
const assert = require('assert/strict');

const cd = require('../../src/builtins/cd');

describe('cd unit test', () => {
  let cwd;

  before('save current working directory', () => {
    cwd = process.cwd();
  });

  after('restore current working directory', () => {
    process.chdir(cwd);
  });

  it('should accept cd .', () => {
    assert.equal(typeof cd('.'), 'string');
  });
  it('should accept cd without arg', () => {
    assert.equal(typeof cd(), 'string');
  });
  it('should accept cd /', () => {
    const path = require('path');
    assert.equal(cd('/../..'), path.resolve('/'));
  });
  it('should accept cd to previous', () => {
    assert.equal(typeof cd.previous(), 'string');
  });
  it('should accept cd to home', () => {
    assert.equal(typeof cd.home(), 'string');
  });
});
