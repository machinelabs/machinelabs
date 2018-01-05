import * as jsonfile from 'jsonfile';

export const pinMachineLabsDependencies = (pathToPackageJson: string) => {
  let fullPath = process.cwd() + pathToPackageJson;
  let pack = jsonfile.readFileSync(fullPath);
  if (pack.dependencies) {
    Object.keys(pack.dependencies).forEach((key, value) => {
      if (key.startsWith('@machinelabs')) {
        pack.dependencies[key] = pack.version;
      } 
    });
  }

  jsonfile.writeFileSync(fullPath, pack, { spaces: 2 });
}
