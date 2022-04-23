'use strict';

import {after, before, beforeEach, describe, it} from 'mocha';
import { assert } from 'chai';

import path = require('path');
import { dirPathCompleter, filePathCompleter, itemPathCompleter } from '../../../src/lib/pathCompleter';

let cwd: string;

before('save current working directory', () => {
  cwd = process.cwd();
});

after('restore current working directory', () => {
  process.chdir(cwd);
});

beforeEach(async () => {
  process.chdir(path.join(__dirname, 'fixtures', 'pathCompleter'));
});

describe('pathCompleter unit test', () => {
  it('itemPathCompleter unit test', () => {
    assert.deepEqual(itemPathCompleter(''), [['dire1', 'dire2', 'file1.md', 'file2.md'], '']);
    assert.deepEqual(itemPathCompleter('dire'), [['dire1', 'dire2'], 'dire']);
    assert.deepEqual(itemPathCompleter('file2.md'), [['file2.md'], 'file2.md']);
    assert.deepEqual(itemPathCompleter('dire1'), [['dire1/'], 'dire1']);
    assert.equal(itemPathCompleter(undefined), undefined);
    assert.deepEqual(itemPathCompleter('doesNotExist'), [[], 'doesNotExist']);
    assert.deepEqual(itemPathCompleter('dire1/fi'), [['file11.md', 'file12.md'], 'fi']);
  });

  it('itemPathCompleter unit test', () => {
    assert.deepEqual(filePathCompleter(''), [['file1.md', 'file2.md'], '']);
    assert.deepEqual(filePathCompleter('file2.md'), [['file2.md'], 'file2.md']);
    assert.deepEqual(filePathCompleter('dire1'), [[], 'dire1']);
  });

  it('dirPathCompleter unit test', () => {
    assert.deepEqual(dirPathCompleter(''), [['dire1', 'dire2'], '']);
    assert.deepEqual(dirPathCompleter('dire'), [['dire1', 'dire2'], 'dire']);
    assert.deepEqual(dirPathCompleter('file2.md'), [[], 'file2.md']);
    assert.deepEqual(itemPathCompleter('dire1'), [['dire1/'], 'dire1']);
  });
});

