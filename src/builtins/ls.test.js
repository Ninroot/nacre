'use strict';

const { describe, it, beforeEach } = require('mocha');
const assert = require('assert/strict');

const { ls } = require('./ls');
const { cd } = require('./cd');

describe('ls unit test', () => {
  beforeEach('move to current dir', () => {
    cd(__dirname);
  });
  it('should return a non empty array when no args', () => {
    assert.ok(ls().length > 1);
  });
  it('should return the filename when a file as argument', () => {
    assert.equal(ls(__filename), __filename);
  });
  it('should return a non empty array when path provided', () => {
    assert.ok(ls('..').length > 1);
  });
  it('should return a non empty array when recursive', () => {
    assert.ok(ls.recursive().length > 1);
  });
  it('should fail when ls a file which does not exist', () => {
    assert.throws(() => ls('fileThatDoesNot.Exist'));
  });
});
