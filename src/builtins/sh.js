'use strict';

const { execSync } = require('child_process');

exports.sh = (command) => {
  if (!command) {
    return undefined;
  }
  const res = execSync(command);
  return res.toString();
};
