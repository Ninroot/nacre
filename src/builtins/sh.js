'use strict';

const { execSync } = require('child_process');

const sh = (command) => {
  if (!command) {
    return undefined;
  }
  const res = execSync(command);
  return res.toString();
};

module.exports = sh;
