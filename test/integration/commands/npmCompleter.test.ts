'use strict';

import { describe, it } from 'mocha';

import { assert } from 'chai';
import { completeNpmPackageName } from '../../../built/commands/npmCompleter';


describe('npm unit test', () => {
  it('completeNpmPackageName', () => {
    // @ts-ignore
    const [hits, line] = completeNpmPackageName('chalk');
    assert.include(hits, 'chalk');
    assert.deepEqual(line, 'chalk');
  });

  it('completeNpmPackageName non existing package', () => {
    // @ts-ignore
    const [hits, line] = completeNpmPackageName('doesNotExist');
    assert.deepEqual(hits, []);
    assert.deepEqual(line, 'doesNotExist');
  });
});
