'use strict';

import {describe, it} from "mocha";

import * as assert from 'assert/strict'
import * as path from "path";
import * as cat from "../../src/builtins/cat";
import { EOL } from 'os';


describe('cat unit test', () => {
  const originalFile = path.join(__dirname, 'fixtures', 'cat', 'original');
  const anotherFile = path.join(__dirname, 'fixtures', 'cat', 'another');

  it('cat file', () => {
    assert.equal(cat(originalFile), `This is a${EOL}test file${EOL}`);
  });

  it('cat read file', () => {
    assert.deepEqual(cat.lines(originalFile), ['This is a', 'test file', '']);
  });

  it('cat write file', () => {
    assert.equal(cat.truncated(anotherFile, 'A test'), 'A test');
    assert.equal(cat(anotherFile), 'A test');
  });

  it('cat append file', () => {
    assert.equal(cat.truncated(anotherFile, ''), '');
    assert.equal(cat.append(anotherFile, 'A'), 'A');
    assert.equal(cat.append(anotherFile, 'test'), 'Atest');
  });
});
