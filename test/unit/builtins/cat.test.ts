'use strict';

import { describe, it } from 'mocha';

import { assert } from 'chai';
import * as path from 'path';
import * as cat from '../../../src/builtins/cat';


describe('cat unit test', () => {
  const originalFile = path.join(__dirname, 'fixtures', 'cat', 'original');
  const anotherFile = path.join(__dirname, 'fixtures', 'cat', 'another');

  it('cat file', () => {
    assert.equal(cat(originalFile), 'carriage return\ncarriage return and line feed\r\nend\n');
  });

  it('cat read file', () => {
    assert.deepEqual(cat.lines(originalFile), ['carriage return', 'carriage return and line feed', 'end', '']);
  });

  it('cat write file', () => {
    assert.equal(cat.overwrite(anotherFile, 'A test'), 'A test');
    assert.equal(cat(anotherFile), 'A test');
  });

  it('cat append file', () => {
    assert.equal(cat.overwrite(anotherFile, ''), '');
    assert.equal(cat.append(anotherFile, 'A'), 'A');
    assert.equal(cat.append(anotherFile, 'test'), 'Atest');
  });
});
