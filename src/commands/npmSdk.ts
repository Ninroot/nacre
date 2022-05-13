import { spawnSync } from 'child_process';

export function npmList(packageName, depth = 0) {
  const list = spawnSync(
    'npm',
    ['list', `--depth=${depth}`, '--json', '--silent', packageName],
    { shell: true },
  );
  return JSON.parse(list.stdout.toString());
}
