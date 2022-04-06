'use strict';

import cat = require('./cat');
import cd = require('./cd');
import grep = require('./grep');
import ls = require('./ls');
import mkdir = require('./mkdir');
import pwd = require('./pwd');
import stat = require('./stat');
import touch = require('./touch');
import chmod = require('./chmod');
import chown = require('./chown');
import sh = require('./sh');

// using `export default function` make the builtins unavailable to use in scripting
export {
  cat,
  cd,
  grep,
  ls,
  mkdir,
  pwd,
  stat,
  touch,
  chmod,
  chown,
  sh,
}
