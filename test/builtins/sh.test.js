'use strict';

const { describe, it } = require('mocha');
const assert = require('assert/strict');

const sh = require('../../src/builtins/sh');

describe('sh unit test', () => {
  it('should return string when ls', () => {
    assert.equal(typeof sh('ls'), 'string');
  });
  it('should return undefined when no arg', () => {
    assert.equal(sh(), undefined);
  });
  it('should return string when echo', () => {
    assert.equal(sh('echo "Hello world!"'), `Hello world!${(require('os').EOL)}`);
  });
});
