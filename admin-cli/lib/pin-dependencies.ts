import * as jsonfile from 'jsonfile';

export const pinMachineLabsDependencies = (pathToPackageJson: string) => {
  const fullPath = process.cwd() + pathToPackageJson;
  const pack = jsonfile.readFileSync(fullPath);
  if (pack.dependencies) {
    Object.keys(pack.dependencies).forEach((key, value) => {
      if (key.startsWith('@machinelabs')) {
        pack.dependencies[key] = pack.version;
      }
    });
  }

  jsonfile.writeFileSync(fullPath, pack, { spaces: 2 });
};
