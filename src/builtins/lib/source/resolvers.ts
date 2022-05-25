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
const resolve = require("resolve").sync;
const rc = require("rc");
const spawnSync = require("child_process").spawnSync;
const isWin32 = process.platform === "win32";

function resolveFn(module, basePath, dirname = "") {
  try {
    return resolve(module, {
      basedir: path.join(basePath, dirname),
    });
  } catch (e) {}
}

// resolve builtin modules such as `path`
function builtinResolve(module) {
  return builtinModules.includes(module) ? module : undefined;
}

// resolve using native require() function
// if NODE_PATH is defined, a global module should be natively resolved
function localResolve(module, dirname) {
  try {
    const localPath = path.resolve(dirname, "node_modules", module);
    return require.resolve(localPath);
  } catch (e) {}
}

// See: http://nodejs.org/docs/latest/api/modules.html#modules_loading_from_the_global_folders
// required?
function nodePathResolve(module, dirname) {
  var i, l, modulePath;
  var nodePath = process.env.NODE_PATH;

  if (!nodePath) {
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

function userHomeResolve(module) {
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

function nodeModulesResolve(module) {
  let i, l, modulePath;

  if (typeof process.env.NODE_MODULES === "string") {
    const nodeModules = process.env.NODE_MODULES.split(path.delimiter);
    for (i = 0, l = nodeModules.length; i < l; i += 1) {
      if ((modulePath = resolveFn(module, nodeModules[i]))) {
        break;
      }
    }
  }

  return modulePath;
}

// See: https://npmjs.org/doc/files/npm-folders.html#prefix-Configuration
// it uses execPath to discover the default prefix on *nix and %APPDATA% on Windows
function prefixResolve(module) {
  var modulePath, dirname;
  var prefix = rc("npm").prefix;

  if (isWin32) {
    prefix = prefix || path.join(process.env.APPDATA, "npm");
    dirname = prefix;
  } else {
    prefix = prefix || path.join(path.dirname(process.execPath), "..");
    dirname = path.join(prefix, "lib");
  }

  dirname = path.join(dirname, "node_modules");
  modulePath = resolveFn(module, dirname);

  return modulePath;
}

// Resolves packages using the node installation path
// Useful for resolving global packages such as npm when the prefix has been overriden by the user
function execPathResolve(module) {
  const execPath = path.dirname(process.execPath);
  const dirname = isWin32
    ? path.join(execPath, "node_modules")
    : path.join(execPath, "..", "lib", "node_modules");
  return resolveFn(module, dirname);
}

function yarnModulesResolve(module) {
  var i, modulePath;

  // Retrieve yarn global path
  var yarnCmd = isWin32 ? "yarn.cmd" : "yarn";
  var result = spawnSync(yarnCmd, ["global", "dir"], { encoding: "utf8" });

  if (!result.error && result.stdout) {
    var yarnPath = result.stdout.replace(/[\r\n]+/g, "");

    var nodeModulesStr = path.join(yarnPath, "node_modules");
    if (typeof nodeModulesStr === "string") {
      var nodeModules = nodeModulesStr.split(path.delimiter);
      for (i = 0; i < nodeModules.length; i++) {
        if ((modulePath = resolveFn(module, nodeModules[i]))) {
          break;
        }
      }
    }
  }

  return modulePath;
}

export const resolvers = [
  builtinResolve,
  localResolve,
  nodePathResolve,
  userHomeResolve,
  nodeModulesResolve,
  yarnModulesResolve,
  prefixResolve,
  execPathResolve,
];
