'use strict';
var fs_1 = require("fs");
var nodePath = require("path");
var userid = require("./lib/userid");
function getType(fileStat) {
    if (fileStat.isFile()) {
        return 'file';
    }
    if (fileStat.isDirectory()) {
        return 'directory';
    }
    if (fileStat.isBlockDevice()) {
        return 'block';
    }
    if (fileStat.isSocket()) {
        return 'socket';
    }
    if (fileStat.isSymbolicLink()) {
        return 'symbolicLink';
    }
    if (fileStat.isFIFO()) {
        return 'fifo';
    }
    if (fileStat.isCharacterDevice()) {
        return 'character';
    }
    return 'unknown';
}
var stat = function (path) {
    var ns = (0, fs_1.lstatSync)(path);
    return {
        name: nodePath.basename(path),
        type: getType(ns),
        size: ns.size,
        createdAt: ns.birthtime,
        modifiedAt: ns.mtime,
        owner: userid.username(ns.uid),
        group: userid.groupname(ns.gid),
    };
};
module.exports = stat;
