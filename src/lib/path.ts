'use strict';

const path = require('path');

// Return true when ends with separator.
path.isDir = (itemPath: string): boolean => {
  if (!itemPath) {
    return false;
  }
  return itemPath.slice(-1) === path.sep;
};

// Get the path of the directory. Similar to dirname but treats when the path ends with a directory.
// 'foo' => '.'
// 'dir/' => 'dir'
// 'dir/bar' => 'dir'
// 'dir/bar/' => 'dir/bar'
// '/dir' => '/'
// '/' => '/'
path.dirPath = (itemPath: string): string => {
  const isDir = path.isDir(itemPath);
  const parsed = path.parse(itemPath);
  if (parsed.root) {
    return parsed.root;
  }
  return isDir ? itemPath.slice(0, -1) : path.dirname(itemPath);
};

export = path;
