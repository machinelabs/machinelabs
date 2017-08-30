import * as chalk from 'chalk';
import { Observable } from '@reactivex/rxjs';
import { factory } from './execute';

import { isRootDir} from './is-root-dir';
import { failWith } from './fail-with';
import { stdout, spawnShell } from '@machinelabs/core';

export function deployClient(project, env) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  return Observable.concat(
    stdout(chalk.green(`Deploying client to ${project} with env=${env}`)),

    spawnShell(`(cd ./client &&
      npm run node_modules &&
      ng build --prod --environment=${env} &&
      firebase use ${project} &&
      firebase deploy)`),

    stdout(chalk.green('Everything live!'))
  );
}
