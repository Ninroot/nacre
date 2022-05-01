'use strict';

import { afterEach, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';

import Repl from '../../../built/lib/repl';

describe('repl unit test', () => {
  let repl: Repl;

  beforeEach(async function () {
    repl = new Repl(process.stdin, process.stdout, '>');
    await repl.init();
  });

  afterEach(() => {
    repl.rl.close();
  });

  describe('handleKeystroke auto closing', function () {
    it('| + ( => (|)', function () {
      process.stdin.push('(');
      assert.equal(repl.rl.line, '()');
      assert.equal(repl.rl.cursor, 1);
    });
    it('"|" + " => ""|', function () {
      process.stdin.push('""');
      assert.equal(repl.rl.line, '""');
      assert.equal(repl.rl.cursor, 2);
    });
    it('"a|" + " => "a"|', function () {
      const seq = '"a"';
      process.stdin.push(seq);
      assert.equal(repl.rl.line, seq);
      assert.equal(repl.rl.cursor, seq.length);
    });
    it('| + ) => )|', function () {
      const seq = ')';
      process.stdin.push(seq);
      assert.equal(repl.rl.line, seq);
      assert.equal(repl.rl.cursor, seq.length);
    });
  });
});
