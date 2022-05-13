import { listByName, searchPackageByName, searchVersionsByName } from "./npmSdk";

export function completeNpmPackageName(line: string): [string[], string] {
  const [pkgName, pkgVersion] = line.split("@");
  if (pkgVersion || pkgVersion === "") {
    try {
      const versions = searchVersionsByName(pkgName).filter((v) =>
        v.startsWith(pkgVersion)
      );
      return [versions.map((v) => pkgName + "@" + v), line];
    } catch {}
  }

  let hits = searchPackageByName(pkgName)
    .filter((p) => p.name.startsWith(line))
    .map((p) => p.name);

  return [hits, pkgName];
}

export function completeNpmUninstallPackageName(
  line: string
): [string[], string] {
  const { dependencies } = listByName();
  const installedPackageNames = dependencies ? Object.keys(dependencies) : [];
  return [installedPackageNames.filter((p) => p.startsWith(line)), line];
}
