import { spawnSync } from 'child_process';
import { npmList } from './npmSdk';

function searchPackageByName(pkgName: string) {
  const { stdout } = spawnSync(
    'npm',
    ['search', '--json', pkgName],
    { shell: true },
  );
  return JSON.parse(stdout.toString());
}

function searchVersionsByName(pkgName: string): string[] {
  const { stdout: versionBuf } = spawnSync(
    'npm',
    ['view', '--json', pkgName, 'versions'],
    { shell: true },
  );
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

export function completeNpmUninstallPackageName(line: string): [string[], string] {
  const { dependencies } = npmList('');
  const installedPackageNames = dependencies ? Object.keys(dependencies) : [];
  return [installedPackageNames.filter((p) => p.startsWith(line)), line];
}
