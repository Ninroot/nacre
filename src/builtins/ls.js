'use strict';

const fs = require('fs');
const path = require('path');

// design decision
// when a filename is given to  ls, it will throw an error in order to:
// distinguish a directory from a file within the directory (ex: foo vs foo/foo)
const ls = (dirpath) => fs.readdirSync(dirpath || '.');
ls.help = 'List directory';

ls.recursive = (dirpath) => {
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
  return walk(dirpath || '.');
};
ls.recursive.help = 'List directory recursively';

exports.ls = ls;
