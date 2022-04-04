'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path: any = require('path');

path.normalizeCurrent = (itemPath) => {
  if (itemPath === '' || itemPath === './') {
    return '';
  }
  return path.normalize(itemPath);
};

export = path;
