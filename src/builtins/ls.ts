'use strict';

import fs = require("fs");
import path = require("path");

// design decision
// when a filename is given to  ls, it will throw an error in order to:
// distinguish a directory from a file within the directory (ex: foo vs foo/foo)
const ls: any = (dirpath?: string) => {
  const p = dirpath || '.';
  const items = fs.readdirSync(p);
  return items.map((item) => path.join(p, item));
};
ls.help = 'List directory';

ls.recursive = (dirpath?: string) => {
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

export = ls;
