'use strict';

import {describe, it} from "mocha";
import * as assert from 'assert/strict'
import {add, remove} from "../../../src/builtins/lib/mod";


describe('mod unit test', () => {
  it('add', () => {
    assert.equal(add(0o000, 0o001), 0o001);
    assert.equal(add(0o001, 0o001), 0o001);
    assert.equal(add(0o777, 0o001), 0o777);
  });
  it('remove', () => {
    assert.equal(remove(0o000, 0o001), 0o000);
    assert.equal(remove(0o001, 0o001), 0o000);
    assert.equal(remove(0o777, 0o001), 0o776);
    assert.equal(remove(0o7, 0o75), 0o2);
  });
});
