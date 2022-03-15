'use strict';

const path = require('path');

path.normalizeCurrent = (itemPath) => {
  if (itemPath === '' || itemPath === './') {
    return '';
  }
  return path.normalize(itemPath);
};

module.exports = path;
