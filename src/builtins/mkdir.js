'use strict';

const path = require('path');
const { mkdirSync } = require('fs');

const mkdir = (dirpath) => {
  path.normalize(dirpath);
  mkdirSync(dirpath, { recursive: false });
  return path.normalize(dirpath);
};

mkdir.recursive = (dirpath) => {
  path.normalize(dirpath);
  mkdirSync(dirpath, { recursive: true });
  return path.normalize(dirpath);
};

exports.mkdir = mkdir;
