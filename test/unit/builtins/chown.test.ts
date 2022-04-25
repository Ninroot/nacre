'use strict';

import { before, describe, it } from 'mocha';
import { assert } from 'chai';
import * as path from 'path';

import stat = require('../../../src/builtins/stat');

describe('chown unit test', () => {
  let chown;
  // chown is not available on Windows
  // eslint-disable-next-line func-names
  before(function () {
    if (process.platform === 'win32') {
      this.skip();
    } else {
      // skip does not prevent importation
      chown = require('../../../src/builtins/chown');
    }
  });

  const testFile = path.join(__dirname, 'fixtures', 'chown', 'test');

  it('chown', () => {
    assert.throws(() => chown());
  });

  it('chown file', () => {
    const actual = chown(testFile);
    assert.ok(actual.user.length > 0);
    assert.ok(actual.group.length > 0);
  });

  it('chown get file', () => {
    const actual = chown.get(testFile);
    assert.ok(actual.user.length > 0);
    assert.ok(actual.group.length > 0);
  });

  it('chown set file same username and group', () => {
    const {
      owner,
      group,
    } = stat(testFile);
    const actual = chown.set(testFile, owner, group);
    assert.equal(actual.user, owner);
    assert.equal(actual.group, group);
  });

  it('chown set file', () => {
    assert.throws(() => chown.set(testFile));
  });

  it('chown set file only username', () => {
    const { owner } = stat(testFile);
    assert.throws(() => chown.set(testFile, owner));
  });

  it('chown set file number', () => {
    assert.throws(() => chown.set(testFile, 123, 456));
  });

  it('chown set file unknown username', () => {
    const unknownUser = 'thisShouldBeAnUnknownUserForTestingOnly';
    assert.throws(() => chown.set(testFile, unknownUser));
  });
});
