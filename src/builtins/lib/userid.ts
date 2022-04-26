'use strict';

let userid: any = {};

if (process.platform === 'win32') {
  userid.username = () => undefined;
  userid.groupname = () => undefined;
} else {
  // eslint-disable-next-line import/no-extraneous-dependencies
  userid = require('userid');
}

export = userid;
