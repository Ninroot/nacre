'use strict';

const {
  describe,
  it,
} = require('mocha');
const assert = require('assert/strict');
const path = require('path');

const chown = require('../../src/builtins/chown');
const stat = require('../../src/builtins/stat');

describe('chown unit test', () => {
  const testFile = path.join(__dirname, 'fixtures', 'chown', 'test');

  it('chown', () => {
    assert.throws(() => chown());
  });

  it('chown file', () => {
    const actual = chown(testFile);
    assert.ok(actual.owner.length > 0);
    assert.ok(actual.group.length > 0);
  });

  it('chown get file', () => {
    const actual = chown.get(testFile);
    assert.ok(actual.owner.length > 0);
    assert.ok(actual.group.length > 0);
  });

  it('chown set file same username and group', () => {
    const {
      owner,
      group,
    } = stat(testFile);
    const actual = chown.set(testFile, owner, group);
    assert.equal(actual.owner, owner);
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
