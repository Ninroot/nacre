'use strict';

const { describe, it } = require('mocha');
const assert = require('assert/strict');
const { add, remove } = require('../../../src/builtins/lib/mod');

describe('mod unit test', () => {
  it('add', () => {
    assert.equal(add(0o000, 0o001), 0o001);
    assert.equal(add(0o001, 0o001), 0o001);
    assert.equal(add(0o777, 0o001), 0o777);
  });
  it('remove', () => {
    assert.equal(remove(0o000, 0o001), 0o000);
    assert.equal(remove(0o001, 0o001), 0o000);
    assert.equal(remove(0o777, 0o001), 0o776);
    assert.equal(remove(0o7, 0o75), 0o2);
  });
});
