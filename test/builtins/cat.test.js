'use strict';

const {
  describe,
  it,
} = require('mocha');
const assert = require('assert/strict');
const path = require('path');
const cat = require('../../src/builtins/cat');


describe('cat unit test', () => {
  const originalFile = path.join(__dirname, 'fixtures', 'cat', 'original');
  const anotherFile = path.join(__dirname, 'fixtures', 'cat', 'another');

  it('cat', () => {
    assert.throws(() => cat());
  });

  it('cat file', () => {
    assert.equal(cat(originalFile), 'This is a\ntest file\n');
  });

  it('cat read file', () => {
    assert.deepEqual(cat.lines(originalFile), ['This is a', 'test file', '']);
  });

  it('cat write file', () => {
    assert.equal(cat.truncated(anotherFile, 'A test'), 'A test');
    assert.equal(cat(anotherFile), 'A test');
  });

  it('cat append file', () => {
    assert.equal(cat.truncated(anotherFile, ''), '');
    assert.equal(cat.append(anotherFile, 'A'), 'A');
    assert.equal(cat.append(anotherFile, 'test'), 'Atest');
  });
});
