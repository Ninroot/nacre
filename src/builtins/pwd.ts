'use strict';

import process = require('process');

/**
 * Return current working directory. Alias of process.cwd().
 * @see process.cwd.
 */
const pwd = (): string => process.cwd();

export = pwd;
