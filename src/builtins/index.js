'use strict';

const windows = process.platform === 'win32';

exports.cat = require('./cat');
exports.cd = require('./cd');
exports.chmod = require('./chmod');
exports.grep = require('./grep');
exports.ls = require('./ls');
exports.mkdir = require('./mkdir');
exports.pwd = require('./pwd');
exports.sh = require('./sh');
exports.stat = require('./stat');
exports.touch = require('./touch');

// userid is not available for windows
if (!windows) {
  exports.chown = require('./chown');
}
