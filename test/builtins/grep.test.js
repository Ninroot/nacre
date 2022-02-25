'use strict';

const {
  describe,
  it,
} = require('mocha');
const assert = require('assert/strict');
const grep = require('../../src/builtins/grep');

describe('grep test', () => {
  it('grep', () => {
    const actual = ['abc', 'bcd', 'efg'].filter(grep(/bc/));
    assert.deepEqual(actual, ['abc', 'bcd']);
  });

  it('grep empty string', () => {
    const actual = ['abc', 'bcd', 'efg'].filter(grep(/''/));
    assert.deepEqual(actual, []);
  });

  it('grep throws', () => {
    assert.throws(() => grep(), {
      message: 'Regex required'
    });
  });
});
