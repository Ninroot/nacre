'use strict';
var userid = {};
if (process.platform === 'win32') {
    userid.username = function () { return undefined; };
    userid.groupname = function () { return undefined; };
}
else {
    userid = require('userid');
}
module.exports = userid;
