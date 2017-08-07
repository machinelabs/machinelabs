import * as chalk from 'chalk';

import { isRootDir } from './is-root-dir';
import { getCurrentVersion } from './get-version';
import { failWith } from './fail-with';

import * as semver from 'semver';

export function incVersion (type) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green(`Current version is:`));
  // All version should be in sync. We use the server version as a reference
  let currentVersion = getCurrentVersion();

  return semver.inc(currentVersion, type);
}
