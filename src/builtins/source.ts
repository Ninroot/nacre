import {resolve} from './lib/source/resolvers';

/**
 * @description - Reads and executes the content of a JavaScript file or JavaScript module. It uses `require` under the hood without cache with a custom resolution.
 * The resolution follows this order:
 * 1. resolve core module (like `path`)
 * 2. resolve the current working directory. Use `pwd()` to get the current working directory.
 * 3. resolve the `$NODE_PATH` environment variable. The variable is set to a colon-delimited (`:`) list of absolute paths for non Windows system and semicolons (`;`) for Windows system.
 * 4. resolve the User home (`$HOME` for non Windows system / `%USERPROFILE%` for Windows system) following sub-directories: 1. `node_modules` 2. `node_libraries` 3. `node_packages`.
 * 5. resolve the `$NODE_MODULES` environment variable. The variable is set to a colon-delimited (`:`) list of absolute paths for non Windows system and semicolons (`;`) for Windows system.
 * 6. resolve global location based on the node installation path.
 * @param moduleName - Name of the module to be required.
 * @return - Exported module content.
 */
const source = function (moduleName) {
  const resolvedModule = resolve(moduleName, process.cwd());
  delete require.cache[resolvedModule];
  if (resolvedModule === undefined) {
    throw Error(`Cannot find module ${moduleName}.`);
  }
  return require(resolvedModule);
};

export = source;
