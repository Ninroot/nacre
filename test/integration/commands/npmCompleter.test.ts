'use strict';

import { describe, it } from 'mocha';

import { assert } from 'chai';
import { completeNpmPackageName } from '../../../built/commands/npmCompleter';


describe('npm unit test', () => {

  it('completeNpmPackageName with existing package', () => {
    const [hits, line] = completeNpmPackageName('chalk');
    assert.include(hits, 'chalk');
    assert.deepEqual(line, 'chalk');
  });

  it('completeNpmPackageName with existing package and existing version', () => {
    const [hits, line] = completeNpmPackageName('chalk@5');
    console.log(hits, line);
    hits.forEach((h) => assert.match(h, /chalk@[0-9]\.[0-9]\.[0-9]/));
    assert.deepEqual(line, 'chalk@5');
  });

  it('completeNpmPackageName non existing package', () => {
    const [hits, line] = completeNpmPackageName('doesNotExist');
    assert.deepEqual(hits, []);
    assert.deepEqual(line, 'doesNotExist');
  });
});
