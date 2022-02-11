'use strict';

const path = require('path');
const {
  closeSync,
  openSync,
  utimesSync,
} = require('fs');

const touch = (filepath) => {
  const time = new Date();
  try {
    // change file access and modification times
    utimesSync(filepath, time, time);
  } catch {
    closeSync(openSync(filepath, 'w'));
  }
  return path.normalize(filepath);
};

module.exports = touch;
