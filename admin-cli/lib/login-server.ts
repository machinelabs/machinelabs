import * as chalk from 'chalk';
import { factory } from './execute';

import { spawn } from 'child_process';
import { isRootDir} from './is-root-dir';
import { failWith } from './fail-with';

let execute = factory({displayErrors: true});

export function loginServer(googleProjectId, zone, serverName) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  console.log(chalk.green(`SSH into ${googleProjectId}/${zone}/${serverName}`));

  var child = spawn(`gcloud`, [
    'compute',
    '--project',
    `${googleProjectId}`,
    'ssh',
    '--zone',
    `${zone}`,
    `root@${serverName}`
    ], { stdio: 'inherit' });

}

