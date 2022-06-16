import {resolve as r} from './lib/source/resolvers';

/**
 * @description - Use the internal source mechanism to look up the location of the given module, but rather than loading
 * the module, it just returns the resolved filepath.
 * @param moduleName - Name of the module to be resolved.
 * @return - filepath of the found module.
 */
const resolve = function (moduleName): string {
  return r(moduleName, process.cwd());
}

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
  const resolvedModule = resolve(moduleName);
  delete require.cache[resolvedModule];
  if (resolvedModule === undefined) {
    throw Error(`Cannot find module ${moduleName}.`);
  }
  return require(resolvedModule);
};

source.resolve = resolve;

export = source;
