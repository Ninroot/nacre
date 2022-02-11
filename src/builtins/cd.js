'use strict';

const os = require('os');

let flip = os.homedir();

const cd = (path) => {
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

module.exports = cd;
