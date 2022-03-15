'use strict';

const {
  beforeEach,
  afterEach,
  describe,
  it,
  before,
  after,
} = require('mocha');
const assert = require('assert/strict');

const path = require('path');
const { Completer } = require('../../src/lib/completer');
const { Inspector } = require('../../src/lib/inspector');
const { cd } = require('../../src/builtins');

let runner;
let completer;

let cwd;

before('save current working directory', () => {
  cwd = process.cwd();
});

after('restore current working directory', () => {
  process.chdir(cwd);
});

beforeEach(async () => {
  cd(path.join(__dirname, 'fixtures', 'completer'));
  runner = new Inspector();
  await runner.start();
  completer = new Completer(runner);
});

afterEach(async () => {
  runner.stop();
});

describe('completer unit test', () => {
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
    const { completions } = await completer.complete();
    ['global', 'Array', '__proto__', 'require']
      .forEach((prop) => assert.ok(completions.includes(prop), `should include ${prop}`));
  });

  it('"|', async () => {
    const { completions } = await completer.complete('"');
    ['dire1', 'dire2', 'file1.md', 'file2.md']
      .forEach((file) => assert.ok(completions.includes(file), `should include ${file}`));
  });

  it('number 123|', async () => {
    const res = await completer.complete('123');
    assert.equal(res, undefined);
  });

  it('thisShouldBeUnknown|', async () => {
    assert.deepStrictEqual(
      await completer.complete('thisShouldBeUnknown'),
      {
        completions: [],
        originalSubstring: 'thisShouldBeUnknown',
        fillable: true,
      },
    );
  });

  it('1 < 2|', async () => {
    assert.equal(
      await completer.complete('1 < 2'),
      undefined,
    );
  });

  it('a = { [computed]: 1 }|', async () => {
    assert.equal(
      await completer.complete('a = { [computed]: 1 }'),
      undefined,
    );
  });

  it('a[1]|', async () => {
    assert.equal(
      await completer.complete('a[1]'),
      undefined,
    );
  });

  it('namedFun(x) { return x}|', async () => {
    assert.equal(
      await completer.complete('function namedFun(x) { return x}'),
      undefined,
    );
  });

  it('"|"', async () => {
    const { completions } = await completer.complete('""', 1);
    ['dire1', 'dire2', 'file1.md', 'file2.md']
      .forEach((file) => assert.ok(completions.includes(file), `should include ${file}`));
  });

  it('|"di"', async () => {
    const res = await completer.complete('"di"', 0);
    assert.equal(res, undefined);
  });

  it('"di|"', async () => {
    const actual = await completer.complete('"di"', 3);
    assert.deepStrictEqual(
      actual,
      {
        completions: ['re1', 're2'],
        originalSubstring: 'di',
        fillable: true,
      },
    );
  });

  it('"./|"', async () => {
    const { completions } = await completer.complete('"./"', 3);
    ['dire1', 'dire2', 'file1.md', 'file2.md']
      .forEach((file) => assert.ok(completions.includes(file), `should include ${file}`));
  });

  it('"./dir|"', async () => {
    const { completions } = await completer.complete('"./dir"', 6);
    assert.deepEqual(completions, ['e1', 'e2']);
  });

  it('ls("dire1/"|', async () => {
    const actual = await completer.complete('ls("dire1/"');
    assert.equal(actual, undefined);
  });

  it('"|whatever"', async () => {
    const { completions } = await completer.complete('"whatever"', 1);
    ['dire1', 'dire2', 'file1.md', 'file2.md']
      .forEach((file) => assert.ok(completions.includes(file), `should include ${file}`));
  });

  it('con|', async () => {
    const actual = await completer.complete('con');
    assert.deepEqual(
      actual,
      {
        completions: ['text', 'sole', 'structor'],
        originalSubstring: 'con',
        fillable: true,
      },
    );
  });

  it('console.|', async () => {
    const { completions } = await completer.complete('console.');
    ['log', 'dir', 'warn', '__proto__']
      .forEach((prop) => assert.ok(completions.includes(prop), `should include ${prop}`));
  });

  it('console.l|', async () => {
    const actual = await completer.complete('console.l');
    assert.deepEqual(
      actual,
      {
        completions: ['og'],
        originalSubstring: 'l',
        fillable: true,
      },
    );
  });

  it('console.log|', async () => {
    const actual = await completer.complete('console.log');
    assert.deepEqual(
      actual,
      {
        completions: [],
        originalSubstring: 'log',
        fillable: true,
      },
    );
  });

  it('console.|log', async () => {
    const { completions } = await completer.complete('console.log', 8);
    ['log', 'dir', 'warn', '__proto__']
      .forEach((prop) => assert.ok(completions.includes(prop), `should include ${prop}`));
  });

  it('con|sole.log', async () => {
    const actual = await completer.complete('con');
    assert.deepEqual(
      actual,
      {
        completions: ['text', 'sole', 'structor'],
        originalSubstring: 'con',
        fillable: true,
      },
    );
  });

  it('console.log(|', async () => {
    const actual = await completer.complete('console.log(');
    assert.deepStrictEqual(
      actual,
      {
        completions: ['...data'],
        fillable: false,
      },
    );
  });

  it('new Number(|', async () => {
    const actual = await completer.complete('new Number(');
    assert.deepStrictEqual(
      actual,
      {
        completions: ['?value'],
        fillable: false,
      },
    );
  });

  it('console.log()', async () => {
    const res = await completer.complete('console.log()');
    assert.equal(res, undefined);
  });

  it('console.log("di|")', async () => {
    const actual = await completer.complete('console.log("di")', 15);
    assert.deepStrictEqual(
      actual,
      {
        completions: ['re1', 're2'],
        originalSubstring: 'di',
        fillable: true,
      },
    );
  });
});
