'use strict';

let userid = {};

if (process.platform === 'win32') {
  userid.username = () => undefined;
  userid.groupname = () => undefined;
} else {
  userid = require('userid');
}

module.exports = userid;
