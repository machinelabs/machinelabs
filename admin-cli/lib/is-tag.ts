import { execSync } from 'child_process';
import { isRootDir } from './is-root-dir';
import { failWith } from './fail-with';

export function isTag() {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  try {
    execSync('git describe --tags --exact-match', { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}
