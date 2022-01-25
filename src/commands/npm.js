'use strict';

const fetch = require('./fetch');

exports.npm = {};

/**
 * Install npm package
 * @param {string} packageName
 */
exports.npm.install = (packageName) => fetch('npm.router.js', '/install', { packageName });

/**
 * Uninstall npm package
 * @param {string} packageName
 * @param {{
 *   save: boolean
 * }}[options]
 */
exports.npm.uninstall = (packageName, options) => fetch('npm.router.js', '/uninstall', { packageName, options });
