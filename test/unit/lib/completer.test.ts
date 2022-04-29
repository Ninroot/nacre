'use strict';

import { afterEach, before, beforeEach, describe, it } from 'mocha';
import { assert } from 'chai';
import path = require('path');

import Completer from '../../../src/lib/completer';
import Inspector from '../../../src/lib/inspector';

const windows = process.platform === 'win32';

describe('completer unit test', () => {
  let runner: Inspector;
  let completer: Completer;

  before('move to fixtures directory', () => {
    process.chdir(path.join(__dirname, 'fixtures', 'completer'));
  });

  beforeEach(async () => {
    runner = new Inspector();
    await runner.start();
    completer = new Completer(runner);
  });

  afterEach(async () => {
    runner.stop();
  });

  it('Remove prefix', () => {
    const actual = completer.removePrefix(['abc', 'abcdeabc', ''], 'abc');
    assert.deepStrictEqual(actual, ['deabc']);
  });

  it('isCompletedString', () => {
    assert.equal(completer.isCompletedString('"hello"'), true);
    assert.equal(completer.isCompletedString('"hello'), false);
    assert.equal(completer.isCompletedString('"hello\''), false);
    assert.equal(completer.isCompletedString('""'), true);
    assert.equal(completer.isCompletedString('"'), false);
  });

  it('No source', async () => {
    const { completion } = await completer.complete(undefined);
    ['global', 'Array', '__proto__', 'require'].forEach((e) => assert.include(completion[0], e));
    assert.equal(completion[1], '');
  });

  it('"|', async () => {
    const { completion } = await completer.complete('"');
    ['dire1', 'dire2', 'file1.md', 'file2.md'].forEach((file) => assert.include(completion[0], file));
  });

  it('number 123|', async () => {
    const actual = await completer.complete('123');
    assert.equal(actual, undefined);
  });

  it('thisShouldBeUnknown|', async () => {
    const actual = await completer.complete('thisShouldBeUnknown');
    assert.equal(actual, undefined);
  });

  it('1 < 2|', async () => {
    const actual = await completer.complete('1 < 2');
    assert.equal(actual, undefined);
  });

  it('a = { [computed]: 1 }|', async () => {
    const actual = await completer.complete('a = { [computed]: 1 }');
    assert.equal(actual, undefined);
  });

  it('a[1]|', async () => {
    const actual = await completer.complete('a[1]');
    assert.equal(actual, undefined);
  });

  it('namedFun(x) { return x}|', async () => {
    const actual = await completer.complete('function namedFun(x) { return x}');
    assert.equal(actual, undefined);
  });

  it('"|"', async () => {
    const { completion } = await completer.complete('""', 1);
    ['dire1', 'dire2', 'file1.md', 'file2.md'].forEach((file) => assert.include(completion[0], file));
  });

  it('|"di"', async () => {
    const actual = await completer.complete('"di"', 0);
    assert.equal(actual, undefined);
  });

  it('"di|"', async () => {
    const { completion } = await completer.complete('"di"', 3);
    assert.deepStrictEqual(completion, [['dire1', 'dire2'], 'di']);
  });

  it('"./|"', async () => {
    const source = process.platform === 'win32' ? '".\\\\"' : '"./"';
    const { completion } = await completer.complete(source, source.length - 1);
    ['dire1', 'dire2', 'file1.md', 'file2.md'].forEach((file) => assert.include(completion[0], file));
  });

  it('"./dir|"', async () => {
    const source = process.platform === 'win32' ? '".\\\\dir"' : '"./dir"';
    const { completion } = await completer.complete(source, source.length - 1);
    assert.deepStrictEqual(completion, [['dire1', 'dire2'], 'dir']);
  });

  it('ls("dire1/"|', async () => {
    const actual = await completer.complete('ls("dire1/"');
    assert.equal(actual, undefined);
  });

  it('"|whatever"', async () => {
    const { completion } = await completer.complete('"whatever"', 1);
    ['dire1', 'dire2', 'file1.md', 'file2.md'].forEach((file) => assert.include(completion[0], file));
  });

  it('con|', async () => {
    const { completion } = await completer.complete('con');
    ['console', 'constructor'].forEach((e) => assert.include(completion[0], e));
    assert.strictEqual(completion[1], 'con');
  });

  it('console.|', async () => {
    const { completion } = await completer.complete('console.');
    ['log', 'dir', 'warn', '__proto__'].forEach((e) => assert.include(completion[0], e));
    assert.strictEqual(completion[1], '');
  });

  it('console.l|', async () => {
    const { completion } = await completer.complete('console.l');
    ['log'].forEach((e) => assert.include(completion[0], e));
    assert.strictEqual(completion[1], 'l');
  });

  it('console.log|', async () => {
    const { completion } = await completer.complete('console.log');
    ['log'].forEach((e) => assert.include(completion[0], e));
    assert.strictEqual(completion[1], 'log');
  });

  it('global.console.lo|', async () => {
    const { completion } = await completer.complete('global.console.lo');
    ['log'].forEach((e) => assert.include(completion[0], e));
    assert.strictEqual(completion[1], 'lo');
  });

  it('console.|log', async () => {
    const { completion } = await completer.complete('console.log', 8);
    ['log', 'dir', 'warn', '__proto__'].forEach((e) => assert.include(completion[0], e));
    assert.strictEqual(completion[1], '');
  });

  it('con|sole.log', async () => {
    const { completion } = await completer.complete('con');
    ['console', 'constructor'].forEach((e) => assert.include(completion[0], e));
    assert.strictEqual(completion[1], 'con');
  });

  // FIXME very slow
  it('console.log(|', async function () {
    if (windows) {
      // FIXME: should work
      this.skip();
    }
    const { signature } = await completer.complete('console.log(');
    assert.strictEqual(signature, '...data');
  });

  it('new Number(|', async function () {
    if (windows) {
      // FIXME: should work
      this.skip();
    }
    const { signature } = await completer.complete('new Number(');
    assert.strictEqual(signature, '?value');
  });

  it('console.log()', async () => {
    const actual = await completer.complete('console.log()');
    assert.equal(actual, undefined);
  });

  it('console.log("di|")', async () => {
    const { completion } = await completer.complete('console.log("di")', 15);
    assert.deepStrictEqual(completion, [['dire1', 'dire2'], 'di']);
  });

  it('mv("|", "")', async () => {
    // 1st argument of mv should complete all items
    const { completion } = await completer.complete('mv("", "")', 4);
    assert.deepStrictEqual(completion, [['dire1', 'dire2', 'file1.md', 'file2.md'], '']);
  });

  it('mv("", "|")', async () => {
    // 2nd argument of mv should complete only directory
    const { completion } = await completer.complete('mv("", "")', 8);
    assert.deepStrictEqual(completion, [['dire1', 'dire2'], '']);
  });


  describe('test findParent', () => {
    it('nominal', () => {
      const obj = {
        l1: { l11: { l111: ['a', 'b', 'c'] } },
        l2: { l21: ['a', 1, {}], l22: 123 },
        l3: [ { l33: {} } ],
      };
      assert.equal(completer.findParent(obj, obj.l1), obj);
      assert.equal(completer.findParent(obj, obj.l1.l11), obj.l1);
      assert.equal(completer.findParent(obj, obj.l2), obj);
      assert.equal(completer.findParent(obj, obj.l2.l21), obj.l2);
      assert.equal(completer.findParent(obj, obj.l2.l22), obj.l2);
      assert.equal(completer.findParent(obj, obj.l3[0]), obj.l3);
      assert.equal(completer.findParent(obj, obj.l3[0].l33), obj.l3[0]);
    });

    it('child does not belong to root', () => {
      const obj = {
        l1: { },
        l2: { },
      };
      const child = {};

      assert.equal(
        completer.findParent(obj, child),
        undefined);
    });

    it('parent of root', () => {
      const obj = {
        l1: { },
        l2: { },
      };

      assert.equal(
        completer.findParent(obj, obj),
        undefined);
    });
  });
});

