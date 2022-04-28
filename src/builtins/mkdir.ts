'use strict';

import path = require('../lib/path');
import { mkdirSync } from 'fs';
import { dirPathCompleter } from '../lib/pathCompleter';

function mkdirRec(dirPath: string, recursive: boolean) {
  const normalizedDirPath = path.normalize(dirPath);
  mkdirSync(normalizedDirPath, { recursive });
  return path.toPosix(normalizedDirPath);
}

/**
 * Create a directory. Wrapper of fs.mkdirSync.
 * @param dirPath - the path of the directory to be created.
 * @return - the path of the newly created directory.
 */
const mkdir = (dirPath: string): string => {
  return mkdirRec(dirPath, false);
};

mkdir.complete = [dirPathCompleter];

/**
 * Create a directory and its intermediate directories as required. Wrapper of fs.mkdirSync.
 * @param dirPath - the path of the directory to be created.
 * @return - the path of the newly created directory.
 */
mkdir.intermediate = (dirPath: string): string => {
  return mkdirRec(dirPath, true);
};

// @ts-ignore
mkdir.intermediate.complete = [dirPathCompleter];

export = mkdir;
