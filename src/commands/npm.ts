'use strict';

const fetch = require('./fetch');

interface Npm {
  /**
   * Install npm package
   * @param {string} packageName
   */
  install(packageName: string);

  /**
   * Uninstall npm package
   * @param {string} packageName
   * @param option
   *   save: boolean
   * }}[options]
   */
  uninstall(packageName: string, option: any);
}

const install = (packageName: string) => {
  fetch('npm.router.js', '/install', {packageName});
};

install.complete = () => {
  return ['acorn', 'nacre'];
};

const npm: Npm = {
  install,
  uninstall: (packageName, options) => {
    fetch('npm.router.js', '/uninstall', {packageName, options});
  },
};

export = npm;
