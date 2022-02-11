'use strict';

const { lstatSync } = require('fs');
const userid = require('userid');
const nodePath = require('path');

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

const stat = (path) => {
  const ns = lstatSync(path);
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
