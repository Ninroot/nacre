'use strict';

import path = require('path');
import { mkdirSync } from 'fs';

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

export = mkdir;
