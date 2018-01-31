import * as jsonfile from 'jsonfile';
import { factory } from './execute';

let execute = factory({displayErrors: true});

export const publishPackage = (pathToPackage: string) => {
  let fullPath = process.cwd() + pathToPackage;

  // yarn publish doesn't read the version from the package.json
  // contrary to `npm publish`. However, yarn has
  // a better authentication mechanism so we are doing a bit
  // of gymnastics here to provide it the version it needs
  let pack = jsonfile.readFileSync(fullPath + '/package.json');

  let version = pack.version;
  // Publishing with build numbers (+something) works fine but as soon
  // as beta versions and build numbers come together (e.g. 0.1.0-beta+4711)
  // the publish doesn't work anymore, hence we cut off the build number
  // as it shouldn't play a role here anyway
  let buildMatch = version.match(/\+.+/)
  version = buildMatch ? version.replace(buildMatch[0], '') : version;

  execute(`(cd ${fullPath} && yarn publish --access=public --new-version=${version})`)
}
