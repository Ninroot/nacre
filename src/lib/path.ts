'use strict';

const path = require('path');

// Return true when ends with separator.
path.isDir = (itemPath: string): boolean => {
  if (!itemPath) {
    return false;
  }
  return itemPath.slice(-1) === path.posix.sep;
};

// Get the path of the directory. Similar to dirname but treats when the path ends with a directory.
// 'foo' => '.'
// 'dir/' => 'dir'
// 'dir/bar' => 'dir'
// 'dir/bar/' => 'dir/bar'
// '/dir' => '/'
// '/' => '/'
path.dirPath = (posixPath: string): string => {
  const isDir = path.isDir(posixPath);
  const parsed = path.posix.parse(posixPath);
  if (parsed.root) {
    return parsed.root;
  }
  return isDir ? posixPath.slice(0, -1) : path.posix.dirname(posixPath);
};

export = path;
