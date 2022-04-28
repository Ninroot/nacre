'use strict';

import fs = require('fs');
import path = require('../lib/path');

/**
 * List the items of a given directory. Wrapper of fs.readdirSync.
 * @param dirPath - path of the directory to be listed. List the current directory if dirPath is omitted.
 * @return - a list of the paths relative to the current working directory.
 * @exception - an exception occurs if a file is given as dirPath.
 * @see cd
 */
const ls = (dirPath?: string): string[] => {
  const p = dirPath || '.';
  return fs.readdirSync(p)
    .map((item) => path.join(p, item))
    .map((itemPath) => path.toPosix(itemPath));
};

/**
 * List the items of a given directory and its subdirectories.
 * @param dirPath - path of the root directory to be listed. List the current directory if dirPath is omitted.
 * @return - a list of the paths relative to the current working directory.
 * @exception - an exception occurs if a file is given as dirPath.
 * @see ls
 */
ls.recursive = (dirPath?: string): string[] => {
  const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.join(dir, file);
      const stat = fs.lstatSync(file);
      results.push(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      }
    });
    return results;
  };
  return walk(dirPath || '.').map((itemPath) => path.toPosix(itemPath));
};

export = ls;
