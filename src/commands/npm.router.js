#!/usr/bin/env node

'use strict';

const { execSync } = require('child_process');
const { router } = require('./router.js');

router.add('/install', (req, res) => {
  const { packageName } = req;
  const command = `npm install ${packageName}`;
  try {
    execSync(command);
    res.success({
      packageName,
      state: 'present',
    });
  } catch (err) {
    res.error(err);
  }
});

router.add('/uninstall', (req, res) => {
  const { packageName, options } = req;
  let args = '';

  if (options) {
    if (options.save === false) {
      args = '--no-save';
    } else if (options.save) {
      args = '--save';
    }
  }

  try {
    const command = `npm uninstall ${packageName} ${args}`;
    execSync(command);
    res.success({
      packageName,
      state: 'absent',
    });
  } catch (err) {
    res.error(err);
  }
});

router.dispatch();
