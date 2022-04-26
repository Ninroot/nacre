'use strict';

import { before, describe, it } from 'mocha';
import { assert } from 'chai';

import $ = require('../../../src/builtins/exec');

describe('sh unit test', () => {
  // eslint-disable-next-line func-names
  before(function () {
    // sh is not present for windows
    if (process.platform === 'win32') {
      this.skip();
    }
  });

  it('should return string when ls', () => {
    assert.equal(typeof $('ls'), 'string');
  });
  it('should return undefined when no arg', () => {
    assert.equal($(undefined), undefined);
  });
  it('should return string when echo', () => {
    assert.equal($('echo "Hello world!"'), 'Hello world!\n');
  });

  it('should raise an exception when existing command status differs from 0', () => {
    assert.throws(() => $('npm'), 'Command failed: npm');
  });

  it('should fail if command does not exist', () => {
    assert.throws(
      () => $('commandThatShouldNotExist'),
      'Command failed: commandThatShouldNotExist',
    );
  });
});
