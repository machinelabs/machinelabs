import * as chalk from 'chalk';
import { concat } from 'rxjs';
import { factory } from './execute';

import { isRootDir } from './is-root-dir';
import { failWith } from './fail-with';
import { stdout, spawnShell } from '@machinelabs/core';

export function deployClient(project, env) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  return concat(
    stdout(chalk.green(`Deploying client to ${project} with env=${env}`)),

    spawnShell(`(cd ./client &&
      npm run node_modules &&
      npx ng build --prod --environment=${env} &&
      npx firebase use ${project} &&
      npx firebase deploy)`),

    stdout(chalk.green('Client successfully deployed!'))
  );
}
