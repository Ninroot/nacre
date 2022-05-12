import { spawnSync } from 'child_process';

function searchPackageByName(pkgName: string) {
  const { stdout } = spawnSync('npm', ['search', '--json', pkgName]);
  return JSON.parse(stdout.toString());
}

function searchVersionsByName(pkgName: string): string[] {
  const { stdout: versionBuf } = spawnSync('npm', ['view', '--json', pkgName, 'versions']);
  return JSON.parse(versionBuf.toString());
}

export function completeNpmPackageName(line: string): [string[], string] {
  const [pkgName, pkgVersion] = line.split('@');
  if (pkgVersion || pkgVersion === '') {
    try {
      const versions = searchVersionsByName(pkgName).filter((v) => v.startsWith(pkgVersion));
      return [versions.map((v) => pkgName + '@' + v), line];
    } catch { }
  }

  let hits = searchPackageByName(pkgName)
    .filter((p) => p.name.startsWith(line))
    .map((p) => p.name);

  return [hits, pkgName];
}
