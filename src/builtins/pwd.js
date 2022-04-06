'use strict';
var process = require("process");
var pwd = function () { return process.cwd(); };
pwd.help = 'Return current working directory. Alias of process.cwd()';
module.exports = pwd;
