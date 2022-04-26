'use strict';

import { lstatSync, Stats } from 'fs';
import * as nodePath from 'path';

import userid = require('./lib/userid');

function getType(fileStat: Stats) {
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

type Stat = {
  name: string,
  type: string,
  size: number,
  createdAt: Date,
  modifiedAt: Date,
  owner?: string,
  group?: string
};

/**
 * Get item status. The returned fields `owner` and `group` are undefined on Windows systems.
 * @param itemPath - the path of the item.
 * @return - status of the item.
 */
const stat = (itemPath: string): Stat => {
  const ns = lstatSync(itemPath);
  return {
    name: nodePath.basename(itemPath),
    type: getType(ns),
    size: ns.size,
    createdAt: ns.birthtime,
    modifiedAt: ns.mtime,
    owner: userid.username(ns.uid),
    group: userid.groupname(ns.gid),
  };
};

export = stat;
