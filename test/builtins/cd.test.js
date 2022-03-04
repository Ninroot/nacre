'use strict';

const { describe, it, before, after } = require('mocha');
const assert = require('assert/strict');

const cd = require('../../src/builtins/cd');

let cwd;

before('save current working directory', () => {
  cwd = process.cwd();
  console.log(cwd);
});

after('restore current working directory', () => {
  process.chdir(cwd);
});

describe('cd unit test', () => {
  it('should accept cd .', () => {
    assert.equal(typeof cd('.'), 'string');
  });
  it('should accept cd without arg', () => {
    assert.equal(typeof cd(), 'string');
  });
  it('should accept cd before than /', () => {
    assert.equal(cd('/../..'), '/');
  });
  it('should accept cd to previous', () => {
    assert.equal(typeof cd.previous(), 'string');
  });
  it('should accept cd to home', () => {
    assert.equal(typeof cd.home(), 'string');
  });
});
