import * as semver from 'semver';
import { factory } from './execute';
import { isRootDir } from './is-root-dir';
import { failWith } from './fail-with';

const execute = factory({ displayErrors: true });

export function getCurrentVersion() {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  return semver.clean(execute(`(cd ./server && node -p -e "require('./package.json').version")`));
}
