import * as chalk from 'chalk';
import { Observable } from '@reactivex/rxjs';
import { factory } from './execute';

import { isRootDir} from './is-root-dir';
import { failWith } from './fail-with';
import { stdout, spawnShell } from '@machinelabs/core';

export function deployFirebase(project) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  return Observable.concat(
    stdout(chalk.green(`Deploying firebase project ${project}`)),
    spawnShell(`(cd ./firebase/functions; firebase use ${project} && npm run deploy)`)
  );
}
