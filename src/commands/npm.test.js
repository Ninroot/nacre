'use strict';

const assert = require('assert/strict');
const { npm } = require('./npm');

assert(
  npm.install('cowsay'),
  { packageName: 'cowsay', state: 'present' },
);

assert(
  npm.uninstall('cowsay', { save: false }),
  { packageName: 'cowsay', state: 'absent' },
);

assert(
  npm.uninstall('cowsay'),
  { packageName: 'cowsay', state: 'absent' },
);
