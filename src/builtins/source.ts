import {resolve} from './lib/source/requireg';

/**
 * @description - Reads and executes the content of a JavaScript file or JavaScript module. It uses `require` under the hood without cache with a custom resolution.
 * The resolution follows this order:
 * 0. resolve core module (like `path`)
 * 1. resolve the current working directory. Use `pwd()` to get the current working directory.
 * 2. resolve the `$NODE_PATH` environment variable. The variable is set to a colon-delimited (`:`) list of absolute paths for non Windows system and semicolons (`;`) for Windows system.
 * 3. resolve the User home (`$HOME` for non Windows system / `%USERPROFILE%` for Windows system) following sub-directories: 1. `node_modules` 2. `node_libraries` 3. `node_packages`.
 * 4. resolve the `$NODE_MODULES` environment variable. The variable is set to a colon-delimited (`:`) list of absolute paths for non Windows system and semicolons (`;`) for Windows system.
 * 5. resolve global location based on: 1. the yarn root directory 2. the prefix found in npm config files 3. the location of node installation path.
 * @param moduleName - Name of the module to be required.
 * @return - Exported module content.
 */
const source = function (moduleName) {
  const resolvedModule = resolve(moduleName, process.cwd());
  delete require.cache[resolvedModule];
  return require(resolvedModule);
};

export = source;
