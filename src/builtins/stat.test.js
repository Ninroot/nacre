'use strict';

const { describe, it } = require('mocha');
const assert = require('assert/strict');

const { stat } = require('./stat');

describe('stat unit test', () => {
  it('should return a basic structure for directory type', () => {
    const s = stat(__dirname);
    assert.equal(s.type, 'directory');
    assert.ok(s.size > 0);
    assert.ok(s.owner.length > 0);
  });
  it('should return a basic structure for file type', () => {
    const s = stat(__filename);
    assert.equal(s.type, 'file');
    assert.ok(s.size > 0);
    assert.ok(s.owner.length > 0);
  });
});
