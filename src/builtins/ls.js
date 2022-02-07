'use strict';

const fs = require('fs');
const path = require('path');

// design decision
// when a filename is given to  ls, it will throw an error in order to:
// distinguish a directory from a file within the directory (ex: foo vs foo/foo)
const ls = (dirpath) => fs.readdirSync(dirpath || '.');
ls.help = 'List directory';

ls.recursive = (dirpath) => {
  const node = dirpath || '.';
  if (fs.lstatSync(node).isDirectory()) {
    const children = ls(node)
      .map((e) => path.join(node, e))
      .map((e) => ls.recursive(e));
    children.push(node);
    return children;
  }
  return node;
};
ls.recursive.help = 'List directory recursively';

exports.ls = ls;
