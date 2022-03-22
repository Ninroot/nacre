'use strict';

const {
  describe,
  it,
} = require('mocha');
const assert = require('assert/strict');

const path = require('../../src/lib/path');

describe('path unit test', () => {
  it('is dir', () => {
    assert.equal(path.normalizeCurrent(''), '');
    assert.equal(path.normalizeCurrent('.'), '.');
    assert.equal(path.normalizeCurrent('./'), '');
    assert.equal(path.normalizeCurrent('./foo'), 'foo');
    assert.equal(path.normalizeCurrent('././foo'), 'foo');
    assert.equal(path.normalizeCurrent('./../foo'), path.normalize('../foo'));
  });
});
