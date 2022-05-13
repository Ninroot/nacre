'use strict';

import { afterEach, beforeEach, describe, it } from 'mocha';

import { assert } from 'chai';
import cat = require('../../../src/builtins/cat');
import npm = require('../../../src/commands/npm');
import path = require('path');
import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import { chdir } from 'process';


describe('npm integration test', () => {
  beforeEach('prepare fixtures directory', async () => {
    const tmp = await mkdtemp(path.join(tmpdir(), 'npm-'));
    chdir(tmp);
    cat.overwrite('package.json', '{}');
  });

  afterEach('', () => {
    chdir(__dirname);
  });

  it('should throw install a package that does not exist', function () {
    assert.throws(
      () => npm.install('doesNotExist'),
      /Not Found - GET/,
    );
  });

  it('should uninstall a package that does not exit', function () {
    const chalk = npm.uninstall('chalk');
    assert.deepEqual(chalk.name, 'chalk');
    assert.isUndefined(chalk.version);
    assert.isUndefined(chalk.resolved);
    assert.equal(chalk.added, 0);
    assert.equal(chalk.removed, 0);
    assert.equal(chalk.changed, 0);
  });

  it('should install chalk', function () {
    const chalk = 'chalk@5.0.0';
    const { name, version, resolved, added, removed, changed } = npm.install(chalk);
    assert.deepEqual(name, 'chalk');
    assert.match(version, /[0-9]+\.[0-9]+\.[0-9]+/);
    assert.isString(resolved);
    assert.equal(added, 1);
    assert.equal(removed, 0);
    assert.equal(changed, 0);

    assert.equal(npm.install(chalk).added, 0);
  });

  it('should uninstall chalk', function () {
    assert.equal(npm.install('chalk@5.0.0').added, 1);

    const { name, version, resolved, added, removed, changed } = npm.uninstall('chalk');
    assert.deepEqual(name, 'chalk');
    assert.match(version, /[0-9]+\.[0-9]+\.[0-9]+/);
    assert.isString(resolved);
    assert.equal(added, 0);
    assert.equal(removed, 1);
    assert.equal(changed, 0);
  });
});
