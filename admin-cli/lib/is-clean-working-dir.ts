import { factory } from './execute';
import { isRootDir } from './is-root-dir';
import { failWith } from './fail-with';

let execute = factory({displayErrors: true});

export function isCleanWorkingDir () {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }
  return execute('git status --porcelain').trim().length === 0;
}
