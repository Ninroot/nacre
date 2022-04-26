'use strict';

import { closeSync, openSync, utimesSync } from 'fs';
import path = require('path');

/**
 * Change item access and modification times. If any file does not exist, it is created.
 * @param itemPath - path of the item.
 * @return path of the item.
 */
const touch = (itemPath: string): string => {
  const time = new Date();
  try {
    // change file access and modification times
    utimesSync(itemPath, time, time);
  } catch {
    closeSync(openSync(itemPath, 'w'));
  }
  return path.normalize(itemPath);
};

export = touch;
