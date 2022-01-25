'use strict';

const { spawnSync } = require('child_process');

module.exports = (filename, endpoint, body) => {
  const json = {
    endpoint,
    body,
  };

  const filepath = require('path').join(__dirname, filename);

  // do break in fork. Do not break exec, spawn
  const res = spawnSync(process.execPath, [filepath, JSON.stringify(json)], { encoding: 'utf-8' });

  if (res.error) {
    return res.error;
  }
  if (res.stderr) {
    return res.stderr;
  }
  if (res.stdout) {
    return JSON.parse(res.stdout.toString());
  }
  return undefined;
};
