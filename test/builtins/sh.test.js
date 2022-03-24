'use strict';

const {
  describe,
  it,
  before
} = require('mocha');
const assert = require('assert/strict');

const sh = require('../../src/builtins/sh');

describe('sh unit test', () => {
  // eslint-disable-next-line func-names
  before(function () {
    // sh is not present for windows
    if (process.platform === 'win32') {
      this.skip();
    }
  });

  it('should return string when ls', () => {
    assert.equal(typeof sh('ls'), 'string');
  });
  it('should return undefined when no arg', () => {
    assert.equal(sh(), undefined);
  });
  it('should return string when echo', () => {
    assert.equal(sh('echo "Hello world!"'), 'Hello world!\n');
  });

  it('should raise an exception when existing command status differs from 0', () => {
    assert.throws(() => {
      sh('npm');
    },
    {
      name: 'CommandFailedError',
      message: 'Command failed: npm',
      status: 1,
      signal: null,
      stdout: /Usage/,
      stderr: '',
    });
  });

  it('should fail if command does not exist', () => {
    assert.throws(() => {
      sh('commandThatShouldNotExist');
    },
    {
      name: 'CommandFailedError',
      status: 127,
    });
  });
});
