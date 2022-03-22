'use strict';

const { chmodSync } = require('fs');
const {
  describe,
  it,
  beforeEach,
  after,
  before,
} = require('mocha');
const assert = require('assert/strict');
const path = require('path');

const chmod = require('../../src/builtins/chmod');

describe('chmod unit test', () => {
  const path0001 = path.join(__dirname, 'fixtures', 'chmod', 'test');
  const path0777 = path.join(__dirname, 'fixtures', 'chmod', 'test2');

  // eslint-disable-next-line func-names
  before(function () {
    if (process.platform === 'win32') {
      this.skip();
    }
  });

  after('give access back to test file for convenience', () => {
    chmodSync(path0001, '0700');
  });

  beforeEach('remove all permission of the test file', () => {
    chmodSync(path0001, '0001');
    chmodSync(path0777, '0777');
  });

  it('chmod undefined', () => {
    assert.throws(() => chmod());
  });

  it('chmod', () => {
    const expect = {
      user: {
        read: false,
        write: false,
        execute: false,
      },
      group: {
        read: false,
        write: false,
        execute: false,
      },
      others: {
        read: false,
        write: false,
        execute: true,
      },
    };
    assert.deepStrictEqual(chmod(path0001), expect);
  });

  it('chmod.add.read', () => {
    const expect = {
      user: {
        read: true,
        write: false,
        execute: false,
      },
      group: {
        read: true,
        write: false,
        execute: false,
      },
      others: {
        read: true,
        write: false,
        execute: true,
      },
    };
    assert.deepStrictEqual(chmod.add.read(path0001), expect);
  });

  it('chmod.add.write', () => {
    const expect = {
      user: {
        read: false,
        write: true,
        execute: false,
      },
      group: {
        read: false,
        write: true,
        execute: false,
      },
      others: {
        read: false,
        write: true,
        execute: true,
      },
    };
    assert.deepStrictEqual(chmod.add.write(path0001), expect);
  });

  it('chmod.add.execute', () => {
    const expect = {
      user: {
        read: false,
        write: false,
        execute: true,
      },
      group: {
        read: false,
        write: false,
        execute: true,
      },
      others: {
        read: false,
        write: false,
        execute: true,
      },
    };
    assert.deepStrictEqual(chmod.add.execute(path0001), expect);
  });

  it('chmod.add.read.user', () => {
    const expect = {
      user: {
        read: true,
        write: false,
        execute: false,
      },
      group: {
        read: false,
        write: false,
        execute: false,
      },
      others: {
        read: false,
        write: false,
        execute: true,
      },
    };
    assert.deepStrictEqual(chmod.add.read.user(path0001), expect);
  });

  it('chmod.add.write.group', () => {
    const expect = {
      user: {
        read: false,
        write: false,
        execute: false,
      },
      group: {
        read: false,
        write: true,
        execute: false,
      },
      others: {
        read: false,
        write: false,
        execute: true,
      },
    };
    assert.deepStrictEqual(chmod.add.write.group(path0001), expect);
  });

  it('chmod.add.execute.others', () => {
    const expect = {
      user: {
        read: false,
        write: false,
        execute: false,
      },
      group: {
        read: false,
        write: false,
        execute: false,
      },
      others: {
        read: false,
        write: false,
        execute: true,
      },
    };
    assert.deepStrictEqual(chmod.add.execute.others(path0001), expect);
  });

  it('chmod.remove.execute', () => {
    const expect = {
      user: {
        read: true,
        write: true,
        execute: false,
      },
      group: {
        read: true,
        write: true,
        execute: false,
      },
      others: {
        read: true,
        write: true,
        execute: false,
      },
    };
    assert.deepStrictEqual(chmod.remove.execute(path0777), expect);
  });

  it('chmod.remove.execute.others', () => {
    const expect = {
      user: {
        read: true,
        write: true,
        execute: true,
      },
      group: {
        read: true,
        write: true,
        execute: true,
      },
      others: {
        read: true,
        write: true,
        execute: false,
      },
    };
    assert.deepStrictEqual(chmod.remove.execute.others(path0777), expect);
  });

  it('chmod.remove.execute', () => {
    const expect = {
      user: {
        read: true,
        write: true,
        execute: false,
      },
      group: {
        read: true,
        write: true,
        execute: false,
      },
      others: {
        read: true,
        write: true,
        execute: false,
      },
    };
    chmod.remove.execute.user(path0777);
    assert.deepStrictEqual(chmod.remove.execute(path0777), expect);
  });

  it('chmod.set.read', () => {
    const expect = {
      user: {
        read: true,
        write: false,
        execute: false,
      },
      group: {
        read: true,
        write: false,
        execute: false,
      },
      others: {
        read: true,
        write: false,
        execute: false,
      },
    };
    assert.deepStrictEqual(chmod.set.read(path0001), expect);
  });

  it('chmod.set', () => {
    const mode = {
      user: {
        read: true,
        write: false,
        execute: true,
      },
      group: {
        read: true,
        write: true,
        execute: true,
      },
      others: {
        read: true,
        write: false,
        execute: true,
      },
    };
    assert.deepStrictEqual(chmod.set(path0001, mode), mode);
  });

  it('chmod.set undefined', () => {
    assert.throws(() => chmod.set(path0001, undefined));
  });
});
