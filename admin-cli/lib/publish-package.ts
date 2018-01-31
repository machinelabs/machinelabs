import * as jsonfile from 'jsonfile';
import { factory } from './execute';

let execute = factory({displayErrors: true});

export const publishPackage = (pathToPackage: string) => {
  let fullPath = process.cwd() + pathToPackage;

  let pack = jsonfile.readFileSync(fullPath + '/package.json');

  execute(`(cd ${fullPath} && yarn publish --access=public --new-version=${pack.version})`)
}
