'use strict';

const process = require('process');

const pwd = () => process.cwd();
pwd.help = 'Return current working directory. Alias of process.cwd()';

module.exports = pwd;
