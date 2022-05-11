import { spawnSync } from 'child_process';

export function completeNpmPackageName(line: string) {
  const { stdout } = spawnSync('npm', ['search', '--json', line]);
  const packages = JSON.parse(stdout.toString());
  const hits = packages
    .filter((p) => p.name.startsWith(line))
    .map((p) => p.name);
  return [hits, line];
}
