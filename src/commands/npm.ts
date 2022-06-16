"use strict";

import { spawnSync } from "child_process";
import { cleanDebuggerOutput, cleanNpmLog, listByName } from "./npmSdk";
import {
  completeNpmPackageName,
  completeNpmUninstallPackageName,
} from "./npmCompleter";

interface Npm {
  /**
   * Install npm package.
   * @param {string} npmPackage - the package from the [NPM definition](https://docs.npmjs.com/cli/v8/commands/npm-install) to install.
   */
  install(npmPackage: string): NpmPackage;

  /**
   * Uninstall npm package.
   * @param {string} packageName - the name of the package to uninstall (do not provide the version).
   */
  uninstall(packageName: string): NpmPackage;
}

class NpmError extends Error {
  private code: string;

  private detail: string;

  constructor(summary: string, code: string, detail: string) {
    super(summary);
    this.name = this.constructor.name;
    this.code = code;
    this.detail = detail;
  }
}

interface NpmPackage {
  name?: string;
  version?: string;
  resolved?: number;
  added?: number;
  removed?: number;
  changed?: number;
}

function getPackageInfo(packageName: string) {
  const list = listByName(packageName, 0);
  // the package does not exist
  if (!list.dependencies) {
    return { name: packageName };
  }
  // extract name from the unique dependency
  const name = Object.keys(list.dependencies)[0];
  const { version, resolved } = list.dependencies[name];
  return { name, version, resolved };
}

function managePackage(
  action: "install" | "uninstall",
  packageName: string
): NpmPackage {
  const pkg: NpmPackage = {};

  if (action === "uninstall") {
    Object.assign(pkg, getPackageInfo(packageName));
  }

  const npmCommand = spawnSync(
    "npm",
    [action, "--color=false", "--json", packageName],
    { shell: true }
  );

  const stderr = cleanDebuggerOutput(npmCommand.stderr.toString());
  if (stderr) {
    const { error } = JSON.parse(cleanNpmLog(stderr));
    throw new NpmError(error.summary, error.code, error.detail);
  }

  const { added, removed, changed } = JSON.parse(npmCommand.stdout.toString());

  pkg.added = added;
  pkg.removed = removed;
  pkg.changed = changed;

  if (action === "install") {
    Object.assign(pkg, getPackageInfo(packageName));
  }

  return pkg;
}

const install = (packageName: string): NpmPackage => {
  return managePackage("install", packageName);
};

install.complete = [completeNpmPackageName];

const uninstall = (packageName: string): NpmPackage => {
  return managePackage("uninstall", packageName);
};

uninstall.complete = [completeNpmUninstallPackageName];

const npm: Npm = {
  install,
  uninstall,
};

export = npm;
