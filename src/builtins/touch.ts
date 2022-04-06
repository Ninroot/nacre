'use strict';

import path = require('path');
import {closeSync, openSync, utimesSync } from 'fs';

const touch = (filepath) => {
  const time = new Date();
  try {
    // change file access and modification times
    utimesSync(filepath, time, time);
  } catch {
    closeSync(openSync(filepath, 'w'));
  }
  return path.normalize(filepath);
}

export = touch;