'use strict';

let userid: any = {};

if (process.platform === 'win32') {
  userid.username = () => undefined;
  userid.groupname = () => undefined;
} else {
  userid = require('userid');
}

export = userid;
