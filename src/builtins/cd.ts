'use strict';

import os = require('os');
import { dirPathCompleter } from '../lib/pathCompleter';
import path = require('../lib/path');

let flip = os.homedir();

/**
 * Change the working directory of the Node.js process for the new directory location.
 * @param dirPath - path of the new directory location. If not provided, equivalent to `cd.home()`.
 * @return posix path of the new directory location.
 * @see cd.home
 */
const cd = (dirPath?: string): string => {
  flip = process.cwd();

  if (!dirPath) {
    return cd.home();
  }

  try {
    process.chdir(dirPath || '.');
    return path.toPosix(process.cwd());
  } catch (err) {
    return err;
  }
};

cd.complete = [dirPathCompleter];

/**
 * Change the working directory to current user's home directory.
 * @return path of the new directory location.
 * @see cd
 * @see os.homedir
 */
cd.home = (): string => cd(os.homedir());

/**
 * Change the working directory to previous user directory.
 * @return path of the new directory location.
 */
cd.previous = (): string => cd(flip);

export = cd;
