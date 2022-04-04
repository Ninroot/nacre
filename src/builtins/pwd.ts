'use strict';

import process = require('process');

const pwd = () => process.cwd();
pwd.help = 'Return current working directory. Alias of process.cwd()';

export = pwd;
