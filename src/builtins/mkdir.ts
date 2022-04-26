'use strict';

import path = require('path');
import { mkdirSync } from 'fs';
import { dirPathCompleter } from '../lib/pathCompleter';

/**
 * Create a directory. Wrapper of fs.mkdirSync.
 * @param dirPath - the path of the directory to be created.
 * @return - the path of the newly created directory.
 */
const mkdir = (dirPath: string): string => {
  path.normalize(dirPath);
  mkdirSync(dirPath, { recursive: false });
  return path.normalize(dirPath);
};

mkdir.complete = [dirPathCompleter];

/**
 * Create a directory and its intermediate directories as required. Wrapper of fs.mkdirSync.
 * @param dirPath - the path of the directory to be created.
 * @return - the path of the newly created directory.
 */
mkdir.intermediate = (dirPath: string): string => {
  path.normalize(dirPath);
  mkdirSync(dirPath, { recursive: true });
  return path.normalize(dirPath);
};

// @ts-ignore
mkdir.intermediate.complete = [dirPathCompleter];

export = mkdir;
