'use strict';

const fetch = require('./fetch');

const npm = {};

/**
 * Install npm package
 * @param {string} packageName
 */
npm.install = (packageName) => fetch('npm.router.js', '/install', { packageName });

/**
 * Uninstall npm package
 * @param {string} packageName
 * @param {{
 *   save: boolean
 * }}[options]
 */
npm.uninstall = (packageName, options) => fetch('npm.router.js', '/uninstall', { packageName, options });

exports.npm = npm;
