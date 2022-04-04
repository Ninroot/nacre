'use strict';

import {describe, it} from "mocha";

import assert = require('assert/strict');

import { completeCall } from '../src/annotations';

describe('ls unit test', () => {
  it('should return a non empty array when no args', () => {
    const expression = {
      type: 'CallExpression',
      start: 0,
      end: 12,
      callee: {
        type: 'MemberExpression',
        start: 0,
        end: 11,
        object: [Object],
        property: [Object],
        computed: false,
        optional: false,
      },
      arguments: [],
      optional: false,
    };
    // eslint-disable-next-line no-console
    const actual = completeCall(console.log, expression, 'console.log(');
    assert.strictEqual(actual, '...data');
  });
});
