'use strict';

import {describe, it} from "mocha";
import assert = require('assert/strict');
import path = require('../../../src/lib/path');

describe('path unit test', () => {
  it('is dir', () => {
    assert.equal(path.normalizeCurrent(''), '');
    assert.equal(path.normalizeCurrent('.'), '.');
    assert.equal(path.normalizeCurrent('./'), '');
    assert.equal(path.normalizeCurrent('./foo'), 'foo');
    assert.equal(path.normalizeCurrent('././foo'), 'foo');
    assert.equal(path.normalizeCurrent('./../foo'), path.normalize('../foo'));
  });
});
