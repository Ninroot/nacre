'use strict';

import os = require('os');

let flip = os.homedir();

const cd: any = (path) => {
  flip = process.cwd();

  if (!path) {
    return cd.home();
  }

  try {
    process.chdir(path || '.');
    return process.cwd();
  } catch (err) {
    return err;
  }
};
cd.help = 'Change directory';

cd.home = () => cd(os.homedir());
cd.home.help = 'Brings you in your home directory';

cd.previous = () => cd(flip);
cd.previous.help = 'Brings you back to your previous location';

export = cd;
