'use strict';

const fs = require('fs');
const path = require('path');

const ls = (dirpath) => fs.readdirSync(dirpath || '.');
ls.help = 'List directory';

ls.recursive = (dirpath) => {
  const node = dirpath || '.';
  if (fs.lstatSync(node).isDirectory()) {
    return ls(node)
      .map((e) => path.join(node, e))
      .map((e) => ls.recursive(e));
  }
  return node;
};
ls.recursive.help = 'List directory recursively';

exports.ls = ls;
