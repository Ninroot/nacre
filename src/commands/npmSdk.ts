import { spawnSync } from "child_process";

// removes from a string the debugger node message
export function cleanDebuggerOutput(str = ""): string {
  return str.startsWith("Debugger listening on ws://") &&
    str.endsWith("Waiting for the debugger to disconnect...\n")
    ? str.split(/\r?\n/).slice(3, -2).join("\n")
    : str;
}

// removes from a string the log npm can produce. Does not handle ANSI color.
// --silent does not always work, see https://github.com/npm/cli/issues/4877
// https://docs.npmjs.com/cli/v8/using-npm/logging
export function cleanNpmLog(str = ""): string {
  return str
    .split(/\r?\n/)
    .filter(
      (line) => !/^npm (info|notice|verb|timing|http|sill|ERR|WARN)/.test(line)
    )
    .join("\n");
}

export function listByName(packageName = "", depth = 0) {
  const { stdout } = spawnSync(
    "npm",
    ["list", `--depth=${depth}`, "--json", "--silent", packageName],
    { shell: true }
  );
  return JSON.parse(stdout.toString());
}

export function searchPackageByName(pkgName: string) {
  const { stdout } = spawnSync("npm", ["search", "--json", pkgName], {
    shell: true,
  });
  return JSON.parse(stdout.toString());
}

export function searchVersionsByName(pkgName: string): string[] {
  const { stdout } = spawnSync("npm", ["view", "--json", pkgName, "versions"], {
    shell: true,
  });
  return JSON.parse(stdout.toString());
}
