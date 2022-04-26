'use strict';

import cat = require('./cat');
import cd = require('./cd');
import chmod = require('./chmod');
import chown = require('./chown');
import grep = require('./grep');
import ls = require('./ls');
import mkdir = require('./mkdir');
import mv = require('./mv');
import pwd = require('./pwd');
import stat = require('./stat');
import touch = require('./touch');
import $ = require('./exec');

// using `export default function` make the builtins unavailable to use in scripting
export {
  cat,
  cd,
  chmod,
  chown,
  grep,
  ls,
  mkdir,
  mv,
  pwd,
  stat,
  touch,
  $,
};
