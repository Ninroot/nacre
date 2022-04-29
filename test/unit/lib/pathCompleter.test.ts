'use strict';

import { before, describe, it } from 'mocha';
import { assert } from 'chai';

import path = require('path');
import { dirPathCompleter, itemPathCompleter } from '../../../src/lib/pathCompleter';

describe('pathCompleter unit test', () => {
  before('move to fixtures directory', () => {
    process.chdir(path.join(__dirname, 'fixtures', 'pathCompleter'));
  });

  it('itemPathCompleter unit test', function () {
    assert.equal(itemPathCompleter(undefined), undefined);
    assert.deepEqual(itemPathCompleter(''), [['.dire1', 'dire1', 'dire2', 'file1.md', 'file2.md'], '']);
    assert.deepEqual(itemPathCompleter('dire'), [['dire1', 'dire2'], 'dire']);
    assert.deepEqual(itemPathCompleter('file2.md'), [['file2.md'], 'file2.md']);
    assert.deepEqual(itemPathCompleter('doesNotExist'), [[], 'doesNotExist']);
    if (process.platform === 'win32') {
      assert.deepEqual(itemPathCompleter('.'), [['.dire1\\\\'], '.']);
      assert.deepEqual(itemPathCompleter('file2.md\\\\.'), [[], '.']);
      assert.deepEqual(itemPathCompleter('dire1'), [['dire1\\\\'], 'dire1']);
      assert.deepEqual(itemPathCompleter('.\\\\'), [['.dire1', 'dire1', 'dire2', 'file1.md', 'file2.md'], '']);
      assert.deepEqual(itemPathCompleter('.\\\\fil'), [['file1.md', 'file2.md'], 'fil']);
      assert.deepEqual(itemPathCompleter('dire1\\\\fi'), [['file11.md', 'file12.md'], 'fi']);

      // FIXME https://github.com/nodejs/node/issues/42895
      // assert.deepEqual(itemPathCompleter('file2.md/../'), [[], '']);

      const [rootCompletion, rootTrailing] = itemPathCompleter('\\');
      assert.isAbove(rootCompletion.length, 1);
      assert.equal(rootTrailing, '');
    } else {
      assert.deepEqual(itemPathCompleter('.'), [['.dire1/'], '.']);
      assert.deepEqual(itemPathCompleter('file2.md/.'), [[], '.']);
      assert.deepEqual(itemPathCompleter('dire1'), [['dire1/'], 'dire1']);
      assert.deepEqual(itemPathCompleter('./'), [['.dire1', 'dire1', 'dire2', 'file1.md', 'file2.md'], '']);
      assert.deepEqual(itemPathCompleter('./fil'), [['file1.md', 'file2.md'], 'fil']);
      assert.deepEqual(itemPathCompleter('dire1/fi'), [['file11.md', 'file12.md'], 'fi']);

      const [rootCompletion, rootTrailing] = itemPathCompleter('/');
      assert.isAbove(rootCompletion.length, 1);
      assert.equal(rootTrailing, '');
    }
  });

  it('dirPathCompleter unit test', () => {
    assert.deepEqual(dirPathCompleter(''), [['.dire1', 'dire1', 'dire2'], '']);
    assert.deepEqual(dirPathCompleter('dire'), [['dire1', 'dire2'], 'dire']);
    assert.deepEqual(dirPathCompleter('file2.md'), [[], 'file2.md']);
    if (process.platform === 'win32') {
      assert.deepEqual(dirPathCompleter('dire1'), [['dire1\\\\'], 'dire1']);
    } else {
      assert.deepEqual(dirPathCompleter('dire1'), [['dire1/'], 'dire1']);
      assert.deepEqual(dirPathCompleter('dire1/'), [['dire11', 'dire12'], '']);
    }
  });
});

