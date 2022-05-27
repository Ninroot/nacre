// MIT License (MIT)
//
// Copyright 2013 Tomas Aparicio
// Copyright 2022 Arnaud Debec
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

import { builtinModules } from "module";

const path = require("path");
const resolveSync = require("resolve").sync;
const isWin32 = process.platform === "win32";

function resolveFn(module, basePath, dirname = "") {
  try {
    return resolveSync(module, {
      basedir: path.join(basePath, dirname),
    });
  } catch (e) {}
}

// resolve builtin modules such as `path`
export function builtinResolve(module) {
  return builtinModules.includes(module) ? module : undefined;
}

// resolve using native require() function
// if NODE_PATH is defined, a global module should be natively resolved
export function localResolve(module, dirname) {
  try {
    // resolve file
    return require.resolve(path.resolve(dirname, module));
  } catch (e) {}
  try {
    return require.resolve(path.resolve(dirname, "node_modules", module));
  } catch (e) {}
}

// See: http://nodejs.org/docs/latest/api/modules.html#modules_loading_from_the_global_folders
// required?
export function nodePathResolve(module, dirname) {
  let i, l, modulePath;
  const nodePath = process.env.NODE_PATH;

  if (!(nodePath && typeof nodePath === "string")) {
    return;
  }

  const nodePaths = nodePath
    .split(path.delimiter)
    .map((p) => path.normalize(p));

  for (i = 0, l = nodePaths.length; i < l; i += 1) {
    if ((modulePath = resolveFn(module, dirname || nodePaths[i]))) {
      break;
    }
  }

  return modulePath;
}

export function userHomeResolve(module) {
  let i, l, modulePath;
  const homePath = isWin32 ? process.env.USERPROFILE : process.env.HOME;
  const paths = ["node_modules", "node_libraries", "node_packages"];

  for (i = 0, l = paths.length; i < l; i += 1) {
    if ((modulePath = resolveFn(module, homePath, paths[i]))) {
      break;
    }
  }

  return modulePath;
}

export function nodeModulesResolve(module) {
  let i, l, modulePath;
  const nodeModules = process.env.NODE_MODULES;

  if (!(nodeModules && typeof nodeModules === "string")) {
    return;
  }

  const mods = nodeModules.split(path.delimiter);
  for (i = 0, l = mods.length; i < l; i += 1) {
    if ((modulePath = resolveFn(module, mods[i]))) {
      break;
    }
  }

  return modulePath;
}

// Resolves packages using the node installation path
// Useful for resolving global packages such as npm when the prefix has been overriden by the user
export function execPathResolve(module) {
  const execPath = path.dirname(process.execPath);
  const dirname = isWin32
    ? path.join(execPath, "node_modules")
    : path.join(execPath, "..", "lib", "node_modules");
  return resolveFn(module, dirname);
}

export function resolve(module, dirname) {
  let i, l, resolver, modulePath;

  const resolvers = [
    builtinResolve,
    localResolve,
    nodePathResolve,
    userHomeResolve,
    nodeModulesResolve,
    execPathResolve,
  ];

  for (i = 0, l = resolvers.length; i < l; i += 1) {
    resolver = resolvers[i];
    if ((modulePath = resolver(module, dirname))) {
      break;
    }
  }

  return modulePath;
}
