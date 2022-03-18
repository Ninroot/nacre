'use strict';

const windows = process.platform === 'win32';

exports.cat = require('./cat');
exports.cd = require('./cd');
exports.grep = require('./grep');
exports.ls = require('./ls');
exports.mkdir = require('./mkdir');
exports.pwd = require('./pwd');
exports.stat = require('./stat');
exports.touch = require('./touch');

// userid is not available for windows
if (!windows) {
  exports.chmod = require('./chmod');
  exports.chown = require('./chown');
} else {
  exports.sh = require('./sh');
}
