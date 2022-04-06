'use strict';
// userid is not available for windows
var fs_1 = require("fs");
var userid = require("./lib/userid");
var stat = require("./stat");
var process_1 = require("process");
var chown = function (itemPath) {
    var ns = (0, fs_1.lstatSync)(itemPath);
    return {
        owner: userid.username(ns.uid),
        group: userid.groupname(ns.gid),
    };
};
chown.get = function (itemPath) { return chown(itemPath); };
chown.set = function (itemPath, username, groupname) {
    (0, fs_1.chownSync)(itemPath, userid.uid(username), userid.gid(groupname));
    return {
        owner: username,
        group: groupname,
    };
};
chown.set.owner = function (itemPath, username) {
    var group = stat(itemPath).group;
    return chown.set(itemPath, username, group);
};
chown.set.group = function (itemPath, groupname) {
    var owner = stat(itemPath).owner;
    return chown.set(itemPath, owner, groupname);
};
module.exports = (process_1.platform === 'win32') ? undefined : chown;
