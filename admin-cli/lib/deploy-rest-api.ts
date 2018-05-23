import * as chalk from 'chalk';
import { concat } from 'rxjs';
import { OutputType, stdout, spawnShell } from '@machinelabs/core';
import { factory } from './execute';
import * as fs from 'fs';
import * as pty from 'node-pty';

import { isRootDir } from './is-root-dir';
import { failWith } from './fail-with';
import { processify } from './processify';

export function deployRestApi(project, env) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  return concat(
    stdout(chalk.green('Deploying REST API')),

    spawnShell(`(cd ./rest-api && npm run node_modules && npm run build -- --env=${env})`),

    processify(() => {
      if (!fs.existsSync('./rest-api/dist')) {
        console.log(chalk.red('Dist does not exist. Aborting'));
        process.exit(1);
      }
    }),

    // tslint:disable-next-line
    spawnShell(`(cd ./rest-api && gcloud app deploy --quiet --project "${project}")`),

    stdout(chalk.green('REST API successfully deployed'))
  );
}
